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

초록을 조금 더 풀어보면, 우리는 비디오 프레임에서 위장된 개체를 탐지하기 위해 단기적인 역학과 장기적인 시간적 일관성을 모두 활용할 수 있는 새로운 비디오 위장 개체 탐지(VCOD) 프레임워크를 제안합니다. 위장된 물체의 본질적인 특성은 일반적으로 배경과 유사한 패턴을 나타내므로 정지 이미지에서 식별하기 어렵다는 것입니다. 따라서 위장된 개체가 움직일 때 눈에 띄기 때문에 비디오의 시간적 역학을 효과적으로 처리하는 것이 VCOD 작업의 핵심이 됩니다. 그러나 현재 VCOD 방법은 모션을 표현하기 위해 호모그래피 또는 광학 흐름을 활용하는 경우가 많습니다. 여기서 감지 오류는 모션 추정 오류와 분할 오류 모두에서 누적될 수 있습니다.

## 서론

VCOD는 움직임이 camouflage를 깨뜨릴 수 있기 때문에 정적 COD와 아예 다른 난점을 가집니다. 이 논문은 그 차이를 가장 본격적으로 다루는 초창기 기준점 중 하나입니다.

서론에서는 특히, VCOD(비디오 위장 개체 탐지)는 비디오에서 배경 장면과 외관상 매우 유사한 개체를 발견하는 작업입니다. 감시 및 보안, 자율 주행, 의료 영상 분할, 메뚜기 탐지 및 로봇 공학 등 다양한 응용 분야를 즐기고 있음에도 불구하고 위장 개체 감지(COD) 문제는 위장 개체를 육안으로 구별할 수 없는 경우가 많기 때문에 어려운 작업입니다. 첫 번째 어려움으로, VCOD를 성공적으로 해결하려면 신경망이 모션 정보의 도움을 받아 위장된 물체와 배경 사이의 미묘한 차이를 효과적으로 발견해야 합니다. MoCA-Mask는 복잡한 배경, 작고 잘 위장된 물체 등 다양한 과제를 캡슐화합니다.

## 본론

핵심은 motion을 별도 전처리로 다루지 않는다는 점입니다. segmentation objective가 motion representation까지 같이 교정하게 만들어, error accumulation을 줄이려 합니다.

## 제안방법

dense correlation volume이 short-term motion을 implicit하게 표현하고, spatio-temporal transformer가 long-term temporal consistency를 강화합니다. 전체 구조는 motion and segmentation joint optimization에 맞춰져 있습니다.

방법을 조금 더 자세히 보면, 우리는 비디오 프레임에서 위장된 개체를 탐지하기 위해 단기적인 역학과 장기적인 시간적 일관성을 모두 활용할 수 있는 새로운 비디오 위장 개체 탐지(VCOD) 프레임워크를 제안합니다. 에서 저자는 원시 광학 흐름이 아닌 각도 필드를 분할하기 위해 네트워크를 사용했습니다. 는 5개 프레임마다 경계 상자로 레이블이 지정된 대규모 위장 데이터 세트(MoCA)와 함께 비디오 등록 및 모션 분할 프레임워크를 제안했습니다. 구체적으로 우리는 단일 최적화 대상에서 모션 추정 및 분할을 학습할 수 있도록 연속 프레임 간의 모션을 암시적으로 캡처하는 단기 모듈을 제안했습니다. 기존의 최첨단 기준선과 비교하여 제안된 네트워크는 두 가지 VCOD 벤치마크에서 놀라운 결과를 달성했습니다.

## 실험

논문은 방법 제안뿐 아니라 MoCA-Mask와 comprehensive VCOD benchmark를 함께 제시해, 이후 비디오 camouflage 연구의 기반을 깔았습니다.

실험 파트를 조금 더 자세히 보면, 이를 위해 데이터 세트를 MoCA-Mask로 재구성하고 보다 포괄적인 평가 기준을 갖춘 종합 벤치마크를 구축합니다. 우리는 우리의 방법을 주로 최고 성능의 단일 이미지 및 비디오 기준과 비교합니다. 네트워크 아키텍처, 입력 해상도, 양식, 전처리 및 후처리가 모두 다르기 때문에 가능한 한 공정하게 비교를 수행하기 위해 최선을 다합니다. COD10K 이미지 데이터 세트와 비교하여 비디오 데이터 세트 MoCA-Mask는 카메라 동작, 이미지 흐릿함, 작은 동물 비율, 날씬한 몸통/팔다리와 같은 작은 신체 구조로 인해 더 까다롭습니다. 연속 프레임에 대한 일관된 성공을 설명하기 위해 Supp의 시퀀스별 정량적 및 정성적 결과와 같은 자세한 내용을 제공합니다.

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
