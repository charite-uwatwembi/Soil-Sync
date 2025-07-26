import numpy as np
import gymnasium as gym
from gymnasium import spaces
from typing import List, Tuple, Optional


class GridWorldEnv(gym.Env):
    """Grid world with moving obstacles that pursue the agent.

    State = [agent_x, agent_y, goal_x, goal_y, obs1_x, obs1_y, obs2_x, obs2_y, ...]
    Action: 0=N,1=S,2=W,3=E
    """

    metadata = {"render_modes": ["human", "state"], "render_fps": 4}

    def __init__(self, render_mode: Optional[str] = None, *, width: int = 10, height: int = 10, n_obstacles: int = 3):
        # Defensive logging to help catch incorrect argument ordering during instantiation
        print(f"Init GridWorldEnv with width={width}, height={height}, obstacles={n_obstacles}, mode={render_mode}")
        super().__init__()
        self.w = width
        self.h = height
        self.n_obs = n_obstacles
        self.render_mode = render_mode

        # observation low/high
        low = np.zeros(4 + 2 * self.n_obs, dtype=np.float32)
        high = np.array([self.w - 1, self.h - 1] * ((4 + 2 * self.n_obs) // 2), dtype=np.float32)
        self.observation_space = spaces.Box(low=low, high=high, dtype=np.float32)

        self.action_space = spaces.Discrete(4)  # N, S, W, E

        self.agent_pos: Optional[Tuple[int, int]] = None
        self.goal_pos: Optional[Tuple[int, int]] = None
        self.obstacles: List[Tuple[int, int]] = []
        self.step_penalty = -0.05
        self.goal_reward = 10.0
        self.collision_penalty = -10.0
        self.max_steps = 200
        self.step_count = 0

    def reset(self, *, seed: Optional[int] = None, options: Optional[dict] = None):
        super().reset(seed=seed)
        rng = np.random.default_rng(seed)
        self.step_count = 0

        # Place agent, goal, obstacles
        self.agent_pos = (rng.integers(0, self.w), rng.integers(0, self.h))
        self.goal_pos = (rng.integers(0, self.w), rng.integers(0, self.h))
        while self.goal_pos == self.agent_pos:
            self.goal_pos = (rng.integers(0, self.w), rng.integers(0, self.h))

        self.obstacles = []
        while len(self.obstacles) < self.n_obs:
            pos = (rng.integers(0, self.w), rng.integers(0, self.h))
            if pos != self.agent_pos and pos != self.goal_pos and pos not in self.obstacles:
                self.obstacles.append(pos)

        return self._get_obs(), {}

    def step(self, action: int):
        if self.agent_pos is None:
            raise ValueError("agent_pos is None — did you forget to call env.reset()?")

        self.step_count += 1
        terminated = False
        truncated = False
        reward = self.step_penalty

        # agent move
        self.agent_pos = self._move(self.agent_pos, action)

        # obstacle move
        self._obstacle_step()

        # check for collision or goal
        if self.agent_pos in self.obstacles:
            terminated = True
            reward += self.collision_penalty
        elif self.agent_pos == self.goal_pos:
            terminated = True
            reward += self.goal_reward

        if self.step_count >= self.max_steps:
            truncated = True

        return self._get_obs(), reward, terminated, truncated, {}

    def _move(self, pos: Tuple[int, int], action: int) -> Tuple[int, int]:
        x, y = pos
        if action == 0 and y > 0:
            y -= 1
        elif action == 1 and y < self.h - 1:
            y += 1
        elif action == 2 and x > 0:
            x -= 1
        elif action == 3 and x < self.w - 1:
            x += 1
        return (x, y)

    def _obstacle_step(self):
        if self.agent_pos is None:
            raise ValueError("agent_pos is None — did you forget to call env.reset()?")

        new_obstacles = []
        ax, ay = self.agent_pos
        for (ox, oy) in self.obstacles:
            dx = np.sign(ax - ox)
            dy = np.sign(ay - oy)
            if np.abs(ax - ox) > np.abs(ay - oy):
                ox += dx
            else:
                oy += dy
            ox = int(np.clip(ox, 0, self.w - 1))
            oy = int(np.clip(oy, 0, self.h - 1))
            new_obstacles.append((ox, oy))
        self.obstacles = new_obstacles

    def _get_obs(self):
        ax, ay = self.agent_pos
        gx, gy = self.goal_pos
        flat_obs = [ax, ay, gx, gy]
        for (ox, oy) in self.obstacles:
            flat_obs.extend([ox, oy])
        while len(flat_obs) < self.observation_space.shape[0]:
            flat_obs.append(0.0)
        return np.array(flat_obs, dtype=np.float32)

    def render(self):
        if self.render_mode != "human":
            return self._get_obs().tolist()
        grid = [["."] * self.w for _ in range(self.h)]
        ax, ay = self.agent_pos
        gx, gy = self.goal_pos
        grid[ay][ax] = "A"
        grid[gy][gx] = "G"
        for (ox, oy) in self.obstacles:
            grid[oy][ox] = "X"
        print("\n".join(" ".join(row) for row in grid))
        print()

    def close(self):
        pass

    def seed(self, seed=None):
        np.random.seed(seed)
