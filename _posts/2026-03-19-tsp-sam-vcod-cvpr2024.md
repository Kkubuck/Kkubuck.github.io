---
layout: "post"
title: "Endow SAM with Keen Eyes: Temporal-spatial Prompt Learning for Video Camouflaged Object Detection"
subtitle: "TSP-SAM은 SAM을 그대로 VCOD에 넣으면 temporal-spatial association과 prompt reliability 문제 때문에 무너진다고 봅니다. 그래서 motion-driven self-prompt와 long-range consistency를 넣어 비디오 위장 객체에 맞게 SAM을 적응시킵니다."
summary: "TSP-SAM은 SAM을 그대로 VCOD에 넣으면 temporal-spatial association과 prompt reliability 문제 때문에 무너진다고 봅니다. 그래서 motion-driven self-prompt와 long-range consistency를 넣어 비디오 위장 객체에 맞게 SAM을 적응시킵니다."
description: "TSP-SAM은 SAM을 그대로 VCOD에 넣으면 temporal-spatial association과 prompt reliability 문제 때문에 무너진다고 봅니다. 그래서 motion-driven self-prompt와 long-range consistency를 넣어 비디오 위장 객체에 맞게 SAM을 적응시킵니다."
date: "2026-03-19 09:00:00 +0900"
slug: "tsp-sam-vcod-cvpr2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "vcod"
  - "sam"
  - "cvpr2024"
venue: "CVPR 2024"
source_url: "https://openaccess.thecvf.com/content/CVPR2024/html/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2024/papers/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.pdf"
---
## 오버뷰

TSP-SAM은 SAM을 그대로 VCOD에 넣으면 temporal-spatial association과 prompt reliability 문제 때문에 무너진다고 봅니다. 그래서 motion-driven self-prompt와 long-range consistency를 넣어 비디오 위장 객체에 맞게 SAM을 적응시킵니다.

## 핵심 주장

- VCOD에서는 user prompt보다 motion-driven self-prompt가 더 현실적이다.
- long-range temporal consistency를 encoder 안으로 넣어 prompt bias와 frame discontinuity를 줄인다.
- 두 개 VCOD benchmarks에서 mIoU가 각각 7.8%, 9.6% 상승했다.

## 초록

Segment Anything은 자연 이미지 segmentation에서는 강하지만, 위장 비디오에서는 temporal-spatial association을 놓치고 사람이 직접 준 prompt도 신뢰하기 어렵습니다. TSP-SAM은 motion cue로 self-prompt를 만들고, long-range consistency를 encoder에 주입해 VCOD에 맞춘 adaptation을 수행합니다.

초록을 조금 더 풀어보면, 프롬프트 기반 기본 모델인 SAM(Segment Anything Model)은 자연스러운 이미지 분할에서 놀라운 성능을 보여주었습니다. 그러나 비디오 위장 개체 감지(VCOD)에 적용하면 주로 간과된 시공간 연관성과 육안으로 식별하기 어려운 위장 개체에 대한 사용자 제공 프롬프트의 신뢰성이 떨어지기 때문에 문제가 발생합니다. 위의 문제를 해결하기 위해 우리는 SAM에 예리한 시각을 부여하고 독창적인 프롬프트 학습 체계를 통해 VCOD에 맞춤화된 새로운 접근 방식인 TSP-SAM(Temporalspatial Prompt SAM)을 제안합니다. 첫째, 모션 기반 자체 프롬프트 학습을 사용하여 위장된 개체를 캡처함으로써 사용자가 제공하는 프롬프트가 필요하지 않습니다.

## 서론

foundation model adaptation이라는 큰 흐름 안에서 보면, 이 논문은 SAM이 어디서 잘 안 통하는지를 꽤 정직하게 보여줍니다. 위장 비디오는 prompt 하나로 해결되기 어렵다는 점이 핵심입니다.

서론에서는 특히, 컴퓨터 비전의 중추적인 작업인 위장 개체 감지는 이미지에서 주변 환경과 원활하게 조화를 이루는 대상 개체를 식별하는 것을 목표로 합니다. 프레임 I(t-T+1) 모션 흐름 프레임 예측 모션 흐름 프레임 예측 의사 마스크 Cat 의사 마스크 의사 마스크 제안 TSP-SAM(c). 그러나 위장영상과 자연영상의 차이로 인해 VCOD에 적용 시 SAM의 성능이 불확실하다는 점은 주목할 만하다. 그러나 위장된 물체와 주변 환경이 완벽하게 혼합되어 육안으로 감지할 수 없게 되어 신뢰할 수 있는 프롬프트를 제공하는 데 엄청난 어려움을 겪습니다.

## 본론

TSP-SAM은 prompt engineering보다 prompt generation에 가깝습니다. 사람이 prompt를 주는 대신 모델이 subtle motion을 보고 스스로 prompt를 만들고, 시간축에서 그 prompt를 안정화합니다.

## 제안방법

motion-driven self-prompt learning이 공간 위치를 잡고, long-range consistency가 inter-frame discontinuity를 줄이며, 이 temporal-spatial 정보를 SAM encoder에 주입해 표현력을 높입니다.

방법을 조금 더 자세히 보면, 핵심 구성 요소는 주로 다음 세 가지 모듈로 구성됩니다. (a) 모션 기반 자체 프롬프트 학습. 모델 최적화 제안된 TSP-SAM을 아래 결합 손실을 최소화하여 엔드 투 엔드 방식으로 훈련합니다. L(t) = LSAM(t) + αLs p(t) + βLd p(t) 여기서 LSAM, Ls p 및 Ld p는 각각 최종 예측, 희소 프롬프트 및 밀집 프롬프트를 감독합니다. 조밀한 프롬프트 손실 Ldp와 최종 예측 손실 LSAM의 경우 감독을 위해 하이브리드 손실을 채택합니다. Lhybrid = Lw ce + Lw iou 여기서 Lw ce는 가중 교차 엔트로피 손실이고 Lw iou는 가중 교차-합집합 손실입니다. DAVIS2016 데이터세트에서 우리 모델은 SOTA SLT-Net과 비슷한 성능을 달성했습니다. 우리 방법은 mIoU에 대해 62.84%를 획득하여 SLT-Net을 9.9% 능가합니다.

## 실험

논문은 두 개의 VCOD benchmark에서 큰 mIoU 상승폭을 제시하며, foundation model adaptation이 비디오 camouflage에도 통할 수 있음을 보여줍니다.

실험 파트를 조금 더 자세히 보면, 두 가지 벤치마크에 대한 광범위한 실험 결과는 제안된 TSP-SAM이 최첨단 방법에 비해 상당한 개선을 달성했음을 보여줍니다. 이 향상된 기능은 SAM 프레임워크 내에서 보다 정확한 탐지에 기여합니다. • MoCA-Mask 및 CAD2016 데이터세트에 대한 광범위한 실험을 통해 제안된 TSP-SAM이 mIoU 메트릭이 7.8% 및 9.6% 증가하여 최첨단 방법에 비해 상당한 성능 향상을 달성했음을 보여줍니다. 2) 정량적 결과: MoCA-Mask 및 CAD2016 데이터 세트에서 TSP-SAM을 평가합니다. DAVIS2016 데이터 세트에서 우리 모델은 SOTA SLT-Net과 비슷한 성능을 달성합니다. 우리 방법은 mIoU에 대해 62.84%를 획득하여 SLT-Net을 9.9% 능가합니다.

### 메인 실험 결과

| 모델 | 연도/학회 | Input | MoCA (M↓ mIoU↑) | CAD (M↓ mIoU↑) |
| --- | --- | --- | --- | --- |
| SINet[10] | 2020-CVPR | Image | 0.574 0.185 0.655 0.030 0.221 0.156 | 0.601 0.204 0.589 0.089 0.289 0.209 |
| SINet-v2[12] | 2021-TPAMI | Image | 0.571 0.175 0.608 0.035 0.211 0.153 | 0.544 0.181 0.546 0.049 0.170 0.110 |
| ZoomNet[32] | 2022-CVPR | Image | 0.582 0.211 0.536 0.033 0.224 0.167 | 0.587 0.225 0.594 0.063 0.246 0.166 |
| BGNet [36] | 2022-IJCAI | Image | 0.590 0.203 0.647 0.023 0.225 0.167 | 0.607 0.203 0.666 0.089 0.345 0.256 |
| FEDERNet[16] | 2023-CVPR | Image | 0.555 0.158 0.542 0.049 0.192 0.132 | 0.607 0.246 0.725 0.061 0.361 0.257 |
| FSPNet[19] | 2023-CVPR | Image | 0.594 0.182 0.608 0.044 0.238 0.167 | 0.539 0.220 0.553 0.145 0.309 0.212 |
| PUENet[44] | 2023-TIP | Image | 0.594 0.204 0.619 0.037 0.302 0.212 | 0.673 0.427 0.803 0.034 0.499 0.389 |
| RCRNet[42] | 2019-ICCV | Video | 0.597 0.174 0.583 0.025 0.194 0.137 | - - - - - - |
| PNS-Net[20] | 2021-MICCAI | Video | 0.576 0.134 0.562 0.038 0.189 0.133 | 0.678 0.369 0.720 0.043 0.409 0.308 |
| MG[43] | 2021-ICCV | Video | 0.547 0.165 0.537 0.095 0.197 0.141 | 0.484 0.314 0.558 0.370 0.351 0.260 |
| SLT-Net[5] | 2022-CVPR | Video | 0.656 0.357 0.785 0.021 0.387 0.310 | 0.679 0.420 0.805 0.033 0.445 0.342 |
| TSP-SAM(M+P) | Ours | Video | 0.673 0.400 0.766 0.012 0.421 0.345 | 0.681 0.500 0.853 0.031 0.496 0.393 |
| TSP-SAM(M+B) | Ours | Video | 0.689 0.444 0.808 0.008 0.458 0.388 | 0.704 0.524 0.912 0.028 0.543 0.438 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

TSP-SAM은 SAM을 단순 fine-tuning하는 대신, 위장 비디오에서 필요한 prompt와 시간 일관성을 다시 설계한 논문입니다.

## 논의

SAM 계열을 COD에 붙이는 시도는 많아졌지만, 이 논문은 특히 비디오 setting에서 무엇을 바꿔야 하는지를 비교적 명확하게 설명해 줍니다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2024/html/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2024/papers/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.pdf
