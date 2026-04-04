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