---
tags: [diffusion-model, generative-model]
title: Diffusion Model
date created: 星期二, 九月 24日 2024, 11:44:43 晚上
date modified: 星期三, 十月 23日 2024, 1:53:40 下午
---

> Diffusion 的数学推导见 [Lecture19-Informal-Definition-of-Diffusion-and-Examples](../stochastic-progress/Lecture19-Informal-Definition-of-Diffusion-and-Examples.md)

## Discrete Time Diffusion Models

在 [Gaussian-Perturbation](Gaussian-Perturbation.md) 中，提到了堆叠 noise 的方法，这种方法会导致高斯噪声不断累积，并最终近似为一个高斯噪声：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/20240924231936.png)

此时的 sampling 也需要反复堆叠 [Langevin Dynamics Sampling](Score-based-Model.md)

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/Screenshot%20from%202024-09-25%2008-25-32.png)

设 $q(x_{0})=p_{data}(x_{0})$，依次增加噪声：

$$
q(x_{t}|x_{t-1})=\mathcal{N}(x_{t};\sqrt{ 1-\beta_{t} }x_{t-1},\beta_{t}I)
$$

可以推导得到

$$
\begin{align}
q(x_{t}|x_{0})&=\mathcal{N}(x_{t};\sqrt{ \overline{\alpha}_{t} }x_{0},(1-\overline{\alpha}_{t})I) \\
\overline{\alpha}_{t} & =\prod_{i=1}^{t} (1-\beta_{i})
\end{align}
$$

这和 [Denoising Score Matching](Score-based-Model.md) 中添加噪声是一致的，并且只要事先给定 $\{ \beta_{i} \}$，就能方便地算出任意时刻 $t$ 添加噪声后的分布 $q(x_{t}|x_{0})$，和 [Gaussian-Perturbation](Gaussian-Perturbation.md) 中指定若干种不同程度的噪声又很相像

然后进行 sampling，希望求得 $q(x_{t-1}|x_{t})$，这样就能从 $q_{T}(x_{T})$ 开始逆向取样了。不过并不好求，考虑使用变分近似（variational approximation，在 [Variational Autoencoders](Latent-Variable-Models.md) 中曾经使用过），引入以 $\theta$ 为参数的函数

$$
p_{\theta}(x_{t-1}|x_{t})=\mathcal{N}(x_{t-1};\mu_{\theta}(x_{t},t),\sigma_{t}^{2}I)
$$

这里 $\mu_{\theta}$ 要以时间 $t$ 为参数，因为不同时刻的分布（噪声程度）是不同的。

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/20240925085813.png)

实际上这是 [VAE](Latent-Variable-Models.md) 的 hierarchical 版本：$x_{1},\dots,x_{T}$ 都是 latent variable，前后依赖，对应的 [ELBO](Latent-Variable-Models.md) 为

$$
\mathbf{E}_{q(x_{1:T}|x_{0})}\left[ \log \left( \frac{p_{\theta }(x_{0},x_{1:T})}{q(x_{1:T}|x_{0})} \right) \right]
$$

另外 $q_{\phi}(z|x)$ 对应 $p(x_{t}|x_{t-1})$，$p(x|z;\theta)$ 对应 $p(x_{t-1}|x_{t};\theta)$，等等

设 ELBO loss (negative log likelihood):

$$
\begin{align}
\mathbf{E}_{q(x_{0})}[-\log p_{\theta}(x_{0})] & \leq \mathbf{E}_{q(x_{0})q(x_{1:T}|x_{0})}\left[ -\log \frac{p_{\theta}(x_{0:T})}{q(x_{1:T}|x_{0})} \right] \\
 & =\mathbf{E}_{q}\left[ -\log p(x_{T}) - \sum_{t \geq 1}^{} \log \frac{p_{\theta}(x_{t-1} | x_{t})}{q(x_{t} | x_{t-1})} \right] \\
 & :=L
\end{align}
$$

这个 loss 本质上是

$$
\mathbf{E}_{x_{0} \sim q(x_{0})}\left[ D_{KL}(q(x_{T}|x_{0}) \Vert p(x_{T})) + \sum_{t > 1}D_{KL}(q(x_{t-1}|x_{t},x_{0}) \Vert p_{\theta}(x_{t-1} | x_{t})) - \log p_{\theta}(x_{0} | x_{1}) \right]
$$

^accb85

即多个 KL divergence 的期望。但是实际中对噪声 $\epsilon$ 进行估计效果更好，也更简单：

$$
L = \mathbf{E}_{x_{0}\sim q(x_{0}),t \sim \mathcal{U}(1,T), \epsilon \sim \mathcal{N}(0,I)}[\lambda_{t}\lVert \epsilon - \epsilon_{\theta}(\sqrt{ \overline{\alpha}_{t} }x_{0}+\sqrt{ 1-\overline{\alpha}_{t} }\epsilon, t) \rVert ^{2}]
$$

这个式子和 [Gaussian-Perturbation](Gaussian-Perturbation.md) 中的 loss 函数本质上相同（score function 都是在尝试 denoising，此处的 $\epsilon_{\theta}(\cdot,t)$ 等价于那里的 $\sigma_{i}s_{\theta}(\cdot,\sigma_{i})$），意味着最小化 ELBO loss 和最小化 denoising score matching 是等价的。这里

$$
\mu_{\theta}(x_{t},t)=\frac{1}{\sqrt{ 1-\beta_{t} }}\left( x_{t}- \frac{\beta_{t}}{\sqrt{ 1-\overline{\alpha}_{t} }}\epsilon_{\theta}(x_{t},t) \right)
$$

中的 $\epsilon_{\theta}$ 用于模拟“扰动”，也就是 [Denoising Score Matching](Score-based-Model.md) 中的 noise，[diffusion process](../stochastic-progress/Lecture19-Informal-Definition-of-Diffusion-and-Examples.md) 中的步长；即 $x_{t-1}$ 的均值应该取 $x_{t}$ 减去 noise 之后的结果（同时还应该配以合适的系数 scaling，可以从数学上推导出来）

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/20240925100250.png)

这里 $\epsilon_{\theta}(x_{t},t)$ 一般用 Unet（和 semantic segmentation 中类似） 进行计算：

![](https://cdn.jsdelivr.net/gh/KinnariyaMamaTanha/Images@images/20240925100810.png)

当然也可以使用 transformer-based 架构，也就是 [GitHub - facebookresearch/DiT: Official PyTorch Implementation of "Scalable Diffusion Models with Transformers"](https://github.com/facebookresearch/DiT)

## Continuous Time Diffusion Models

> 需要将离散情况连续化，使用 SDE/ODE，数学推导可参考 [Lecture19-Informal-Definition-of-Diffusion-and-Examples](../stochastic-progress/Lecture19-Informal-Definition-of-Diffusion-and-Examples.md)，没做笔记。
