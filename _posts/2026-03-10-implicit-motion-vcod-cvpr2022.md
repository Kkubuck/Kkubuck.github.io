---
layout: "post"
title: "Implicit Motion Handling for Video Camouflaged Object Detection"
subtitle: "이 논문은 비디오 COD에서 optical flow나 homography 같은 explicit motion이 오히려 오차를 누적시킬 수 있다고 보고, motion estimation과 segmentation을 하나의 최적화로 묶는 implicit motion handling을 제안합니다."
summary: "이 논문은 비디오 COD에서 optical flow나 homography 같은 explicit motion이 오히려 오차를 누적시킬 수 있다고 보고, motion estimation과 segmentation을 하나의 최적화로 묶는 implicit motion handling을 제안합니다."
description: "이 논문은 비디오 COD에서 optical flow나 homography 같은 explicit motion이 오히려 오차를 누적시킬 수 있다고 보고, motion estimation과 segmentation을 하나의 최적화로 묶는 implicit motion handling을 제안합니다."
date: "2026-03-10 09:00:00 +0900"
slug: "implicit-motion-vcod-cvpr2022"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "vcod"
  - "cvpr2022"
venue: "CVPR 2022"
source_url: "https://openaccess.thecvf.com/content/CVPR2022/html/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2022/papers/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.pdf"
---

## 오버뷰

이 논문은 비디오 COD에서 optical flow나 homography 같은 explicit motion이 오히려 오차를 누적시킬 수 있다고 보고, motion estimation과 segmentation을 하나의 최적화로 묶는 implicit motion handling을 제안합니다.

## 핵심 주장

- VCOD의 핵심은 short-term dynamics와 long-term temporal consistency를 함께 다루는 것이다.
- explicit motion representation은 motion error와 segmentation error를 함께 누적시킨다.
- implicit motion handling과 spatio-temporal transformer를 결합하고, 대규모 VCOD dataset MoCA-Mask를 함께 제공한다.

## 초록

저자들은 dense correlation volume으로 인접 프레임 간 motion을 implicit하게 잡고, segmentation supervision으로 motion estimation과 segmentation을 joint optimization합니다. 여기에 spatio-temporal transformer를 더해 시간 일관성을 보강합니다.

## 서론

VCOD는 움직임이 camouflage를 깨뜨릴 수 있기 때문에 정적 COD와 아예 다른 난점을 가집니다. 이 논문은 그 차이를 가장 본격적으로 다루는 초창기 기준점 중 하나입니다.

## 본론

핵심은 motion을 별도 전처리로 다루지 않는다는 점입니다. segmentation objective가 motion representation까지 같이 교정하게 만들어, error accumulation을 줄이려 합니다.

## 제안방법

dense correlation volume이 short-term motion을 implicit하게 표현하고, spatio-temporal transformer가 long-term temporal consistency를 강화합니다. 전체 구조는 motion and segmentation joint optimization에 맞춰져 있습니다.

## 실험

논문은 방법 제안뿐 아니라 MoCA-Mask와 comprehensive VCOD benchmark를 함께 제시해, 이후 비디오 camouflage 연구의 기반을 깔았습니다.

### 메인 실험 결과

Table 2. Quantitative results on CAD dataset.

| 모델 | Sα↑ | Fwβ↑ | Eφ↑ | M↓ | mDice | mIoU |
| --- | --- | --- | --- | --- | --- | --- |
| EGNet [50] | 0.619 | 0.298 | 0.666 | 0.044 | 0.324 | 0.243 |
| BASNet [30] | 0.639 | 0.349 | 0.773 | 0.054 | 0.393 | 0.293 |
| CPD [43] | 0.622 | 0.289 | 0.667 | 0.049 | 0.330 | 0.239 |
| PraNet [11] | 0.629 | 0.352 | 0.763 | 0.042 | 0.378 | 0.290 |
| SINet [10] | 0.636 | 0.346 | 0.775 | 0.041 | 0.381 | 0.283 |
| SINet-v2 [8] | 0.653 | 0.382 | 0.762 | 0.039 | 0.413 | 0.318 |
| PNS-Net [14] | 0.655 | 0.325 | 0.673 | 0.048 | 0.384 | 0.290 |
| RCRNet [45] | 0.627 | 0.287 | 0.666 | 0.048 | 0.309 | 0.229 |
| MG [46] | 0.594 | 0.336 | 0.691 | 0.059 | 0.368 | 0.268 |
| SLT-Net (Ours) | 0.696 | 0.481 | 0.845 | 0.030 | 0.493 | 0.401 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

VCOD를 논문 단위로 본격화한 대표 작업이라서, 비디오 camouflage 계열을 읽을 때 거의 반드시 지나가게 되는 논문입니다.

## 논의

최근 SAM 기반 VCOD나 memory-based video model을 볼 때도, motion을 explicit하게 볼지 implicit하게 볼지의 기준은 여전히 이 논문과 연결됩니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2022/html/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2022/papers/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.pdf
