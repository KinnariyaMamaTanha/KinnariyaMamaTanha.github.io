---
tags: [generative-model]
title: Summary
date created: 星期三, 九月 25日 2024, 3:39:37 下午
date modified: 星期三, 九月 25日 2024, 3:53:18 下午
---

## 刻画概率分布的方式

### Probability Density / Mass Functions

> 最容易想到的刻画方式，一般只涉及一阶导，不涉及二阶导，故而计算较能被接受。根据不同的切入点会有很不一样的处理手段。

- [Autoregressive-Models](Autoregressive-Models.md)
- [Flow-Models](Flow-Models.md)
- [Variational Autoencoders](Latent-Variable-Models.md)
- [Energy-Based-Model-(EBM)](Energy-Based-Model-(EBM).md)

### Sampling Progress

> 通过样本间接刻画分布，推导中不村在分布的直接参与，难点在于训练不稳定

### Score Function

> 也就是通过刻画 log-derivative 来间接刻画分布，难点在于会有原函数的二阶导出现，需要去除以提高计算效率

- [Score-based-Model](Score-based-Model.md)

## 刻画概率分布之间的距离

- two sample test (见 GAN)
- [Maximum-Likelihood-Learning](Maximum-Likelihood-Learning.md)
- [Score-Matching](Score-Matching.md)
- [Noise-Contrastive-Estimation](Noise-Contrastive-Estimation.md)

## 生成模型的评估
