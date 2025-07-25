from pathlib import Path

from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env

# Import environment from the same package
from .gridworld_env import GridWorldEnv


MODEL_DIR = Path(__file__).resolve().parent.parent / "ML_Models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)
MODEL_PATH = MODEL_DIR / "iot_agent_ppo"

def main():
    """Train a PPO agent and save it under ML_Models/. Run with:
        python -m rl_env.train_iot_agent
    """
    # Vectorised env for faster learning
    env = make_vec_env(GridWorldEnv, n_envs=8)

    model = PPO(
        "MlpPolicy",
        env,
        verbose=1,
        n_steps=2048,
        batch_size=256,
        gae_lambda=0.95,
        learning_rate=3e-4,
        gamma=0.99,
    )

    timesteps = 1_000_000      # or any value you want
    model.learn(total_timesteps=timesteps)

    model.save(str(MODEL_PATH))
    print(f"✅ Training complete — model saved to {MODEL_PATH}.zip")


if __name__ == "__main__":
    main() 