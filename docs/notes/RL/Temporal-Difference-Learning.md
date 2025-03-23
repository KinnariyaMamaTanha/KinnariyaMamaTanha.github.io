---
title: Temporal Difference Learning
tags:
  - RL
math: true
---
TD learning 算法是基于 [Chapter 6](Stochastic-Approximation.md) 的一大类算法。

## TD Learning of State Values

> 用于给定策略时，学习 state value，本质上是求解 Bellman equation 的一个 RM 算法

**Bellman expectation equation**:

$$
\begin{align*}
    v_\pi(s) &= \mathbb{E}[R + \gamma G \mid S = s] \\
    &= \mathbb{E}[R + \gamma v_\pi(S') \mid S = s]
\end{align*} 
$$

对于从给定的策略 $\pi$，得到 $(s_0, r_1, s_1, \ldots, s_t, r_{t+1}, s_{t+1}, \ldots)$，记为 $\{ (s_t, r_{t+1}, s_{t+1}) \}$。TD algorithm 为：

$$
\begin{align*}
    v_{t+1}(s_t) &= v_t(s_t) - \alpha_t(s_t)\left[ v_t(s_t) - [r_{t+1} + \gamma v_t(s_{t+1})] \right] \\
    v_{t+1}(s) &= v_t(s), \quad \forall s \neq s_t
\end{align*} 
$$

- 对 $t = 0,1,2,\ldots$，这里 $v_t(s_t)$ 是 $v_\pi(s_t)$ 的估计，$\alpha _t(s_t)$ 为 $s_t$ 在时刻 $t$ 的 learning rate（注意下标 $t$ 的含义不同）
- 在 $t$ 时刻，只有被访问到的 state $s_t$ 被更新
- $\overline{v}_t = r_{t+1} + \gamma v_t(s_{t+1})$ 被称为 TD target，也就是，在得到新的信息 $(s_t, r_{t+1}, s_{t+1})$ 后，可以对当前的状态 $s_t$ 进行更新
- $\delta_t =  v_t(s_t) - \overline{v}_t$ 称为 TD error

TD learning 的收敛性定理：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409100942270.png)

TD/Sarsa learning 和 MC learning 的对比：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409100944608.png)

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409100947032.png)

需要记住的是，TD 是低方差、高误差的，而 MC 是高方差、低误差的，不过可以平衡两者得到 [GAE](GAE.md)

## TD Learning of Action Values

### Sarsa

> TD learning of action values，也就是进行 policy evaluation

和上节中的 TD learning 算法几乎一样，只是将 $v(s_t)$ 替换为 $q(s_t, a_t)$：

$$
\begin{align*}
    q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha _t(s_t, a_t)\left[ q_t(s_t, a_t) - [r_{t+1} + \gamma q_t (s_{t+1}, a_{t+1})] \right] \\
    q_{t+1}(s,a) &= q_t(s,a), \quad \forall (s,a) \neq (s_t, a_t)
\end{align*}
$$

Sarsa 收敛性定理：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409100957412.png)

可以和 policy improvement 过程结合，也称为 sarsa 算法。伪代码：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409100959339.png)

### Expected Sarsa

> 和上面的公式相比，将 $q_{t}(s_{t+1},a_{t+1})$ 替换为了 $\mathbb{E}\left[ q_{t}(s_{t+1},A) \right]$ 

$$
\begin{align*}
    q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha _t(s_t, a_t)\left[ q_t(s_t, a_t) - [r_{t+1} + \gamma \mathbb{E}[q_t (s_{t+1}, A)]] \right] \\
    q_{t+1}(s,a) &= q_t(s,a), \quad \forall (s,a) \neq (s_t, a_t)
\end{align*}
$$

这里

$$
\mathbb{E}[q_t(s_{t+1}, A)] = \sum_{a \in A}^{} \pi_t(a|s_{t+1})q_t(s_{t+1}, a) = v_t(s_{t+1})
$$

于是只需要 $(s_t, a_t, r_{t+1}, s_{t+1})$ 四个随机变量（因为 $a_{t+1}$ 被期望替代掉了），相对于原始的 Sarsa 算法，variance 也会变小

Expected sarsa 实际上是在求解：

$$
q_\pi(s,a) = \mathbb{E}\left[ R_{t+1} + \gamma \mathbb{E}_{A_{t+1} \sim \pi(S_{t+1})}[q_\pi(S_{t+1}, A_{t+1})] \mid S_t = s, A_t = a \right]
$$

也是 Bellman equation 的一个变型

### N-step Sarsa

> 结合了 Sarsa 和 Monte Carlo Learning

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101023293.png)

也就是说，Sarsa 和 MC 都是 n-step Sarsa 的极端情况

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101026142.png)

分析：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101032455.png)

## TD Learning of Optimal Action Values

### Q-learning

$$
\begin{align*}
    q_{t+1}(s_t, a_t) &= q_t(s_t, a_t) - \alpha _t(s_t, a_t)\left[ q_t(s_t, a_t) - [r_{t+1} + \gamma \max _{a \in \mathcal{A}}q_t(s_{t+1}, a) ] \right] \\
    q_{t+1}(s,a) &= q_t(s,a), \quad \forall (s,a) \neq (s_t, a_t)
\end{align*}
$$

> 相较于 Sarsa，将 TD target 从 $r_{t+1} + \gamma q_t(s_{t+1}, a_{t+1})$ 替换为了 $r_{t+1} + \gamma \max _{a \in \mathcal{A}} q_t(s_{t+1}, a)$
> 即 $a_{t+1} \to \arg\max_{a\in A}q_{t}(s_{t+1},a)$

数学上，Q-learning 求解等式：

$$
q(s, a) = \mathbb{E}\left[R_{t+1} + \max _{a} q(S_{t+1}, a) \mid S_t = s, A_t = a\right]
$$

也就是 Bellman optimal equation 的变体。

#### Off-policy & On-policy

- **Behavior policy**：和环境交互得到 experience 的策略
- **Target policy**：目标中一直更新，想要得到最优的策略
- **On-policy**：behavior policy 和 target policy 相同
- **Off-policy**：behavior policy 和 target policy 不同

Sarsa 和 MC 都是 on-policy 的。而 Q-learning 是 off-policy 的.

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101115590.png)

- On-policy: $\pi \rightarrow \text{experience} \rightarrow \text{some information} \rightarrow \text{new } \pi \rightarrow \cdots$
- Off-policy: $\text{behavior policy } \pi_{\beta} \to \text{experience} \to \text{some information} \to \text{new target policy } \pi_{\tau} \to \cdots$

伪代码：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101116142.png)

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101122653.png)

在 off-policy 中：

- $\pi_b$：behavior policy，是任意选取的，因此也不需要 $\epsilon$ -greedy 进行 PI (policy improvement)，只需要用 greedy 就行
- $\pi_{\tau}$：target policy

由于 off-policy 的性质，Q-learning 可以和深度学习相结合

## 几种算法的对比

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101130819.png)

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@main/202409101132336.png)
