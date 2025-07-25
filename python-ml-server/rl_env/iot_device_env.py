import numpy as np
import gymnasium as gym
from gymnasium import spaces


class IoTDeviceEnv(gym.Env):
    """A simple environment that models an IoT soil-sensor node with a small set of
    actions.  The agent must keep soil moisture and nutrient levels within
    acceptable ranges while conserving battery power.

    Observation vector (7 floats):
    0. soil_moisture %  [0‒100]
    1. nitrogen fraction [0‒1]
    2. phosphorus ppm    [0‒50]
    3. potassium ppm     [0‒200]
    4. battery %         [0‒100]
    5. x position        [0‒grid_width-1]
    6. y position        [0‒grid_height-1]

    Actions (Discrete 8):
    0 – Idle (sleep)
    1 – Take measurement + transmit (small battery cost, tiny reward)
    2 – Irrigate (↑ moisture, battery cost)
    3 – Fertilize (↑ NPK, high battery cost)
    4 – Move North (-y)
    5 – Move South (+y)
    6 – Move West (-x)
    7 – Move East (+x)
    """

    metadata = {"render_modes": ["human", "state"], "render_fps": 4}

    def __init__(self, render_mode: str | None = None):
        super().__init__()
        self.render_mode = render_mode

        # Grid configuration
        self.grid_width = 10
        self.grid_height = 10

        # Observation space bounds (soil vars + battery + x + y)
        low = np.array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], dtype=np.float32)
        high = np.array([100.0, 1.0, 50.0, 200.0, 100.0, self.grid_width - 1, self.grid_height - 1], dtype=np.float32)
        self.observation_space = spaces.Box(low=low, high=high, dtype=np.float32)

        # Action space: idle, measure+tx, irrigate, fertilize, move N,S,W,E
        self.action_space = spaces.Discrete(8)

        self.state: np.ndarray | None = None
        self.step_count = 0
        self.max_steps = 288  # ~12 days at 1-hour steps

        # Tunable coefficients
        self.moisture_decay = (0.5, 1.5)  # per step random loss
        self.base_battery_drain = 0.2

    # ------------------------------------------------------------------
    # Core Gym API
    # ------------------------------------------------------------------
    def reset(self, *, seed: int | None = None, options: dict | None = None):
        super().reset(seed=seed)
        rng = np.random.default_rng(seed)
        start_x = self.grid_width // 2
        start_y = self.grid_height // 2
        self.state = np.array(
            [
                rng.uniform(30, 70),   # soil moisture %
                rng.uniform(0.1, 0.5), # nitrogen
                rng.uniform(10, 25),   # phosphorus
                rng.uniform(80, 150),  # potassium
                100.0,                 # battery
                float(start_x),
                float(start_y),
            ],
            dtype=np.float32,
        )
        self.step_count = 0
        info: dict = {}
        return self.state.copy(), info

    def step(self, action: int):
        if self.state is None:
            raise RuntimeError("Call reset() before step().")

        soil_m, nitro, phos, potas, battery, pos_x, pos_y = self.state
        reward = 0.0
        terminated = False
        truncated = False

        # --- Base battery drain each hour
        battery -= self.base_battery_drain

        # --- Action-specific effects
        if action == 0:
            # Idle / deep-sleep
            pass
        elif action == 1:
            # Measure + transmit
            battery -= 0.5
            reward += 0.1  # small positive reward for delivering data
        elif action == 2:
            # Irrigate
            battery -= 1.0
            soil_m = min(100.0, soil_m + 10)
        elif action == 3:
            # Fertilize
            battery -= 2.0
            nitro = min(1.0, nitro + 0.05)
            phos = min(50.0, phos + 3)
            potas = min(200.0, potas + 10)
        elif action == 4:  # Move North (-y)
            battery -= 0.5
            pos_y = max(0.0, pos_y - 1)
        elif action == 5:  # Move South (+y)
            battery -= 0.5
            pos_y = min(self.grid_height - 1, pos_y + 1)
        elif action == 6:  # Move West (-x)
            battery -= 0.5
            pos_x = max(0.0, pos_x - 1)
        elif action == 7:  # Move East (+x)
            battery -= 0.5
            pos_x = min(self.grid_width - 1, pos_x + 1)
        else:
            raise ValueError(f"Invalid action {action}")

        # --- Natural environment dynamics (leaching, crop uptake)
        soil_m -= np.random.uniform(*self.moisture_decay)
        nitro -= 0.005
        phos  -= 0.1
        potas -= 0.5

        # Clamp values within bounds
        soil_m = np.clip(soil_m, 0.0, 100.0)
        nitro  = max(0.0, nitro)
        phos   = max(0.0, phos)
        potas  = max(0.0, potas)
        battery = max(0.0, battery)

        # --- Reward shaping
        moisture_reward = -abs(55 - soil_m) / 55  # closest to 55% moisture is best
        nutrient_penalty = 0.0
        if nitro < 0.1 or phos < 5 or potas < 50:
            nutrient_penalty = -1.0
        battery_penalty = -1.0 if battery < 10 else 0.0
        reward += moisture_reward + nutrient_penalty + battery_penalty

        # Update state & counters
        self.state = np.array([soil_m, nitro, phos, potas, battery, pos_x, pos_y], dtype=np.float32)
        self.step_count += 1

        # Termination conditions
        if battery <= 0.0:
            terminated = True  # device died
        if self.step_count >= self.max_steps:
            truncated = True  # episode time limit reached

        info: dict = {}
        return self.state.copy(), reward, terminated, truncated, info

    # ------------------------------------------------------------------
    # Rendering helpers
    # ------------------------------------------------------------------
    def render(self):
        if self.render_mode == "human":
            soil_m, n, p, k, b, x, y = self.state
            print(
                f"Step {self.step_count}: Pos=({x:.0f},{y:.0f}) Moisture={soil_m:.1f}% N={n:.2f} P={p:.1f} K={k:.1f} Battery={b:.1f}%"
            )
        elif self.render_mode == "state":
            return self.state.tolist()

    def close(self):
        pass 