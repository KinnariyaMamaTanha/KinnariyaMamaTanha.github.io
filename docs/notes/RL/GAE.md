---
title: Generalized Advantage Estimation
tags:
  - RL
math: true
---

> 用 GPT 生成

在强化学习（RL）中，GAE 指的是 **广义优势估计（Generalized Advantage Estimation）**，它是一种用于计算策略梯度方法中的 **优势函数（Advantage Function）** 的技巧，能够 **在偏差（bias）和方差（variance）之间取得平衡**，从而提高训练稳定性和收敛速度。

## **GAE 的背景**

在策略优化方法（如 A2C、PPO、TRPO）中，优势函数用于衡量某个动作相对于策略的平均回报是否更优。常见的优势估计方法包括：

- **Monte Carlo 估计**（高方差，低偏差）
- **时间差分（TD）估计**（低方差，高偏差）

GAE 通过引入**时间差分误差（TD error）**的指数加权和，结合 TD 学习和 Monte Carlo 采样，平衡了二者的优缺点。

## **GAE 公式**

GAE 的核心是基于**TD 误差（δ）** 的递归计算：

$$
\delta_{t}=r_{t} + \gamma V(s_{t+1}) - V(s_{t})
$$

然后使用指数衰减因子 $\lambda$ 计算 GAE：

$$
\hat{A}_{t}^{\mathrm{GAE}}=\sum_{l=0}^{\infty} (\gamma \lambda)^{l}\delta_{t+l}
$$

其中：

- $\gamma$ 是折扣因子（通常 0.99）
- $\gamma$ 是 GAE 平滑因子（通常 0.95）

GAE 结合了 TD(0)（当 $\lambda=0$）和 Monte Carlo（当 $\lambda=1$）的方法，在 $\lambda\in(0,1)$ 之间可以调节偏差-方差权衡。

## **GAE 的优点**

- **减少方差，提高稳定性**：相比单纯的 Monte Carlo 方法，GAE 具有更低的方差，使得策略梯度方法训练更稳定。
- **加速收敛**：能够更快地学习到更优的策略。
- **广泛应用**：GAE 是 PPO、TRPO 等强化学习算法的重要组成部分。

**总结**：GAE 是一种改进的优势估计方法，它使用 TD 误差的加权和来降低方差，提高策略优化方法（如 PPO）的稳定性和效率。