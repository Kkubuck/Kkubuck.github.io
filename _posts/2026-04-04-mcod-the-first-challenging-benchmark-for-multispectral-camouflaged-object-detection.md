---
layout: post
title: "MCOD: The First Challenging Benchmark for Multispectral Camouflaged Object Detection"
subtitle: "Camouflaged Object Detection (COD) aims to identify objects that blend seamlessly into natural scenes. Although RGB-based methods have advanced, their performance remains limited under challenging conditions."
summary: "Camouflaged Object Detection (COD) aims to identify objects that blend seamlessly into natural scenes. Although RGB-based methods have advanced, their performance remains limited under challenging conditions."
date: "2026-04-04"
slug: "mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection"
paper: true
categories: papers
tags:
  - paper
  - arxiv
  - summary
image: "/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-15.png"
source_pdf: "https://arxiv.org/pdf/2509.15753.pdf"
source_url: "https://arxiv.org/abs/2509.15753"
pdf_url: "https://arxiv.org/pdf/2509.15753.pdf"
arxiv_id: "2509.15753"
license: "unknown"
model: "Qwen/Qwen3-14B-Instruct-2507"
model_path: ""
backend: "auto"
review_status: "pass"
featured_overview_image: "/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-15.png"
featured_table_image: "/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/main-table-page-05.png"
---

# MCOD: The First Challenging Benchmark for Multispectral Camouflaged Object Detection

> Camouflaged Object Detection (COD) aims to identify objects that blend seamlessly into natural scenes. Although RGB-based methods have advanced, their performance remains limited under challenging conditions.

## 오버뷰

<div class="paper-spotlight-grid">
  <figure class="paper-spotlight-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-15.png" alt="Figure 2: Illustration of the eight challenging attributes in the MCOD dataset.">
    <figcaption>
      <strong>대표 오버뷰 피규어</strong>
      <span class="paper-caption">Figure 2: Illustration of the eight challenging attributes in the MCOD dataset.</span>
      <span class="paper-reason">선정 이유: caption='Figure 2: Illustration of the eight challenging attributes in the MCOD dataset.', page=3, score=3.70, selected-role=overview</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="paper-spotlight-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/main-table-page-05.png" alt="main table snapshot page 5">
    <figcaption>
      <strong>메인 실험 테이블</strong>
      <span class="paper-caption">Table 4: Comparison of results under RGB and MSI inputs.</span>
      <span class="paper-reason">선정 이유: page=5, score=18.55, caption='Table 4: Comparison of results under RGB and MSI inputs.', table-match</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
</div>

## 핵심 주장

- Camouflaged Object Detection (COD) aims to identify objects that
blend seamlessly into natural scenes. (p. 1)
- Although RGB-based methods
have advanced, their performance remains limited under challenging conditions. (p. 1)
- Multispectral imagery, providing rich spectral information, offers a promising alternative for enhanced foregroundbackground discrimination. (p. 1)
- However, existing COD benchmark
datasets are exclusively RGB-based, lacking essential support for
multispectral approaches, which has impeded progress in this area. (p. 1)

## 초록
Camouflaged Object Detection (COD) aims to identify objects that
blend seamlessly into natural scenes. Although RGB-based methods
have advanced, their performance remains limited under challenging conditions.

## 서론
Camouflaged Object Detection (COD) has recently emerged as
a growing research area focused on identifying objects that are
visually integrated into their surrounding environments. This task
holds broad applicability and strategic importance in domains such
as military reconnaissance, medical diagnostics, and agricultural
pest monitoring [12, 22, 26, 36].

- Camouflaged Object Detection (COD) has recently emerged as
a growing research area focused on identifying objects that are
visually integrated into their surrounding environments.
- This task
holds broad applicability and strategic importance in domains such
as military reconnaissance, medical diagnostics, and agricultural
pest monitoring [12, 22, 26, 36].
- Driven by advances in deep learning, RGB-based COD methods
have achieved notable progress [4, 24, 31].
## 본론
Several influential
open-source benchmark datasets, such as CHAMELEON [27], CAMOCOCO [19], COD10K [9], and NC4K [25], have greatly promoted
the development of camouflaged object detection based on RGB
images. CHAMELEON is a small-scale, non-peer-reviewed dataset
consisting of 76 camouflaged images collected from the internet
via keyword searches.

- Several influential
open-source benchmark datasets, such as CHAMELEON [27], CAMOCOCO [19], COD10K [9], and NC4K [25], have greatly promoted
the development of camouflaged object detection based on RGB
images.
- CHAMELEON is a small-scale, non-peer-reviewed dataset
consisting of 76 camouflaged images collected from the internet
via keyword searches.
- CAMO-COCO includes 2,500 images, among
which the CAMO subset provides 1,250 images with seven challenging attributes designed to increase detection difficulty.
## 제안방법
Venue
𝑬𝝃↑
𝑺𝜶↑
𝑭𝜷↑
𝑴↓
SINet[10]
CVPR 2020
0.758
0.616
0.369
0.006
LSR[25]
CVPR 2021
0.830
0.625
0.373
0.005
CODCEF[18]
Sensors 2021
0.763
0.677
0.444
0.004
C2FNet[28]
IJCAI 2021
0.726
0.721
0.403
0.010
C2FNet-V2[5]
TCSVT 2022
0.913
0.810
0.654
0.008
SINet-V2[9]
TPAMI 2022
0.849
0.728
0.492
0.004
ASBI[35]
CVIU 2023
0.684
0.675
0.370
0.014
FIRNet[14]
TVC 2024
0.882
0.738
0.537
0.004
PRNet[17]
TCSVT 2024
0.926
0.826
0.698
0.002
IdeNet[15]
TIP 2024
0.846
0.808
0.588
0.004
PCNet[33]
arXiv 2024
0.633
0.855
0.386
0.003
attribute for quantitative evaluation. Figure 3(d) visualizes the frequency distribution of these attributes, while Figure 3(e) illustrates
the co-occurrence of attributes, revealing their interrelationships.

- Venue
𝑬𝝃↑
𝑺𝜶↑
𝑭𝜷↑
𝑴↓
SINet[10]
CVPR 2020
0.758
0.616
0.369
0.006
LSR[25]
CVPR 2021
0.830
0.625
0.373
0.005
CODCEF[18]
Sensors 2021
0.763
0.677
0.444
0.004
C2FNet[28]
IJCAI 2021
0.726
0.721
0.403
0.010
C2FNet-V2[5]
TCSVT 2022
0.913
0.810
0.654
0.008
SINet-V2[9]
TPAMI 2022
0.849
0.728
0.492
0.004
ASBI[35]
CVIU 2023
0.684
0.675
0.370
0.014
FIRNet[14]
TVC 2024
0.882
0.738
0.537
0.004
PRNet[17]
TCSVT 2024
0.926
0.826
0.698
0.002
IdeNet[15]
TIP 2024
0.846
0.808
0.588
0.004
PCNet[33]
arXiv 2024
0.633
0.855
0.386
0.003
attribute for quantitative evaluation.
- Figure 3(d) visualizes the frequency distribution of these attributes, while Figure 3(e) illustrates
the co-occurrence of attributes, revealing their interrelationships.
- According to the results shown in the figure, the most prevalent
challenge attributes in MCOD are complex shape, extreme illumination, and small object, collectively accounting for 65.1% of the
entire dataset.
## 실험
In this section, 저자들은 benchmark eleven 최신 기법(state-of-the-art) camouflaged
object detection methods on the newly proposed MCOD dataset. All experiments were conducted on an NVIDIA GEFORCE RTX
3090 24GB GPU, with multispectral images as inputs.

- In this section, 저자들은 benchmark eleven 최신 기법(state-of-the-art) camouflaged
object detection methods on the newly proposed MCOD dataset.
- All experiments were conducted on an NVIDIA GEFORCE RTX
3090 24GB GPU, with multispectral images as inputs.
- To enable
these models to operate on multispectral inputs, 저자들은 adapted the
input layer by expanding the original 3-channel RGB input to 8
channels.
## 결론
In this paper, 저자들은 present MCOD, the first large-scale benchmark for
multispectral camouflaged object detection. MCOD comprises 1,527
carefully registered and calibrated multispectral images collected
from diverse real-world scenarios.

- In this paper, 저자들은 present MCOD, the first large-scale benchmark for
multispectral camouflaged object detection.
- MCOD comprises 1,527
carefully registered and calibrated multispectral images collected
from diverse real-world scenarios.
- Each image is accompanied by
pixel-level ground-truth annotations and eight challenging attribute
labels.
## 논의
원문에서 해당 섹션을 명확히 추출하지 못했다.


## 그림 전체
<div class="figure-grid">
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-01.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 1</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-02.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 2</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-03.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 3</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-04.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 4</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-05.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 5</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-06.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 6</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-07.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 7</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-08.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 8</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-09.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 9</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-10.png" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 10</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-11.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 11</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-12.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 12</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-13.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 13</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-14.jpeg" alt="Figure 1: RGB response curves and spectral signatures of">
    <figcaption>
      <strong>Figure 14</strong>
      <span class="paper-caption">Figure 1: RGB response curves and spectral signatures of</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-15.png" alt="Figure 2: Illustration of the eight challenging attributes in the MCOD dataset.">
    <figcaption>
      <strong>Figure 15</strong>
      <span class="paper-caption">Figure 2: Illustration of the eight challenging attributes in the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-16.png" alt="Figure 3: Statistical analysis of the MCOD dataset.">
    <figcaption>
      <strong>Figure 16</strong>
      <span class="paper-caption">Figure 3: Statistical analysis of the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-17.jpeg" alt="Figure 3: Statistical analysis of the MCOD dataset.">
    <figcaption>
      <strong>Figure 17</strong>
      <span class="paper-caption">Figure 3: Statistical analysis of the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-18.png" alt="Figure 3: Statistical analysis of the MCOD dataset.">
    <figcaption>
      <strong>Figure 18</strong>
      <span class="paper-caption">Figure 3: Statistical analysis of the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-19.jpeg" alt="Figure 3: Statistical analysis of the MCOD dataset.">
    <figcaption>
      <strong>Figure 19</strong>
      <span class="paper-caption">Figure 3: Statistical analysis of the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-20.png" alt="Figure 3: Statistical analysis of the MCOD dataset.">
    <figcaption>
      <strong>Figure 20</strong>
      <span class="paper-caption">Figure 3: Statistical analysis of the MCOD dataset.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-21.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 21</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-22.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 22</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-23.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 23</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-24.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 24</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-25.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 25</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-26.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 26</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-27.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 27</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-28.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 28</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-29.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 29</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-30.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 30</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-31.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 31</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-32.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 32</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-33.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 33</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-34.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 34</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-35.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 35</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-36.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 36</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-37.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 37</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-38.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 38</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-39.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 39</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-40.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 40</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-41.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 41</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-42.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 42</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-43.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 43</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-44.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 44</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-45.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 45</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-46.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 46</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-47.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 47</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-48.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 48</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-49.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 49</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-50.jpeg" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 50</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-51.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 51</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-52.png" alt="Figure 4: Visualization of detection results under various challenging scenarios.">
    <figcaption>
      <strong>Figure 52</strong>
      <span class="paper-caption">Figure 4: Visualization of detection results under various challenging scenarios.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-53.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 53</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-54.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 54</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-55.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 55</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-56.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 56</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-57.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 57</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-58.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 58</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-59.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 59</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-60.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 60</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-61.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 61</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-62.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 62</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-63.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 63</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-64.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 64</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-65.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 65</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-66.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 66</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-67.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 67</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-68.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 68</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-69.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 69</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-70.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 70</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-71.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 71</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-72.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 72</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-73.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 73</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-74.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 74</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-75.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 75</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-76.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 76</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-77.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 77</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-78.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 78</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-79.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 79</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-80.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 80</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-81.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 81</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-82.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 82</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-83.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 83</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-84.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 84</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-85.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 85</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-86.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 86</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-87.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 87</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-88.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 88</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-89.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 89</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-90.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 90</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-91.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 91</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-92.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 92</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-93.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 93</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-94.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 94</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-95.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 95</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-96.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 96</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-97.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 97</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-98.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 98</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-99.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 99</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-100.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 100</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-101.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 101</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-102.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 102</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-103.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 103</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-104.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 104</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-105.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 105</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-106.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 106</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-107.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 107</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-108.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 108</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-109.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 109</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-110.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 110</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-111.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 111</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-112.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 112</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-113.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 113</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-114.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 114</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-115.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 115</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-116.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 116</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-117.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 117</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-118.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 118</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-119.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 119</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-120.jpeg" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 120</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-121.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 121</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-122.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 122</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-123.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 123</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-124.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 124</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-125.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 125</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-126.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 126</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-127.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 127</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-128.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 128</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-129.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 129</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-130.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 130</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-131.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 131</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-132.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 132</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
  <figure class="figure-card">
    <img src="/assets/papers/mcod-the-first-challenging-benchmark-for-multispectral-camouflaged-object-detection/figures/figure-133.png" alt="Figure 5: Improvements in missed and false detections enabled by multispectral modality.">
    <figcaption>
      <strong>Figure 133</strong>
      <span class="paper-caption">Figure 5: Improvements in missed and false detections enabled by multispectral modality.</span>
      <span class="paper-source">출처: https://arxiv.org/abs/2509.15753</span>
    </figcaption>
  </figure>
</div>

## 검수 로그
<div class="verification-box">
<strong>1차 팩트체크</strong>: pass
- 통과

<strong>2차 팩트체크</strong>: pass
- 통과
</div>

## 출처
- 원문 PDF: https://arxiv.org/pdf/2509.15753.pdf
- 논문 페이지: https://arxiv.org/abs/2509.15753
- PDF URL: https://arxiv.org/pdf/2509.15753.pdf
- 라이선스: unknown
- 모델: Qwen/Qwen3-14B-Instruct-2507
- 백엔드: auto