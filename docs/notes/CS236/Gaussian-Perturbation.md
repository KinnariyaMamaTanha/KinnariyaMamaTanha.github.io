---
tags: [generative-model, score-based-model]
title: Gaussian Perturbation
date created: 星期二, 九月 24日 2024, 9:52:15 晚上
date modified: 星期三, 九月 25日 2024, 11:39:08 中午
---

> 在 [score-based-model](Score-based-Model.md) 中存在的一些问题可以用 Gaussian Perturbation 来解决

通过对真实数据添加适当的噪声（像 [Denoising Score Matching](Score-based-Model.md) 中一样），可以提高模型准确率。但是不知道多少噪声比较合适：太少则数据质量高但预测 score function 质量底，太多则相反

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/Screenshot%20from%202024-09-24%2022-06-11.png)

解决方法：多设置几个噪声方差 $\sigma_{1} > \sigma_{2} > \dots > \sigma_{L}$，并且使用 **annealed Langevin Dynamics** 来进行采样（即在 Langevin Dynamics 中逐次降低 noise 的方差，使用上一次 noise 的结果作为这一次的初始状态）

此时训练的 loss 函数：

$$
\begin{align}
 & \quad \frac{1}{L}\sum_{i=1}^{L} \lambda(\sigma_{i})\mathbf{E}_{q_{\sigma_{i}(x)}}[\lVert \nabla_{x}\log q_{\sigma_{i}}(x) - s_{\theta}(x, \sigma_{i}) \rVert _{2}^{2}] \\
 & =\frac{1}{L}\sum_{i=1}^{L} \lambda(\sigma_{i})\mathbf{E}_{x \sim p_{data}}\mathbf{E}_{\tilde{x} \sim q_{\sigma_{i}}(\tilde{x} | x)}[\lVert \nabla_{\tilde{x}}\log q_{\sigma_{i}}(\tilde{x} | x) - s_{\theta}(x, \sigma_{i}) \rVert ^{2}_{2} ] + \text{const}\\
 & =\frac{1}{L} \sum_{i=1}^{L} \lambda(\sigma_{i}) \mathbf{E}_{x \sim p_{data}} \mathbf{E}_{z \sim \mathcal{N}(0,I)}\left[ \left\lVert  s_{\theta}(x + \sigma_{i}z,\sigma_{i})  + \frac{z}{\sigma_{i}} \right\rVert _{2}^{2}  \right] + \text{const}
\end{align}
$$

^e7145d

其中 $\lambda(\sigma_{i})$ 为不同的权重

选择 $\sigma_{i}$ 的方式：$\sigma_{1}$ 选择样本点间最大距离，$\sigma_{L}$ 选择最小距离，构造等比数列。可以取 $\lambda(\sigma_{i})=\sigma_{i}^{2}$，这样上述 loss 函数变为：

$$
\begin{align}
 & \quad\frac{1}{L}\sum_{i=1}^{L} \sigma_{i}^{2}\mathbb{E}_{x \sim p_{data}}\mathbb{E}_{z \sim \mathcal{N}(0,I)} \left[ \left\lVert  s_{\theta}(x + \sigma_{i}z,\sigma_{i}) + \frac{z}{\sigma_{i}}  \right\rVert _{2}^{2} \right] \\
 & =\frac{1}{L} \sum_{i=1}^{L} \mathbb{E}_{x \sim p_{data}} \mathbb{E}_{z \sim \mathcal{N}(0, I)}\left[\lVert  \sigma_{i}s_{\theta}(x + \sigma_{i}z, \sigma_{i}) +z \rVert _{2}^{2}\right]
\end{align}
$$

这里 $z$ 代表 noise。训练时每次随机选取若干 $\sigma_{i}$，作为该次训练的噪声集

除了将不同的 noise loss 加权求和，还可以堆叠在一起，不断加噪声，最终会近似呈一个 Gaussian Distribution，[Diffusion-Model](Diffusion-Model.md) 就此诞生

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/20240924231936.png)
