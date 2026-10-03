---
title: 'UCOD-DPL: Unsupervised Camouflaged Object Detection via Dynamic Pseudo-label Learning'
description: 고정 전략과 교사 모델의 의사 라벨을 동적으로 섞고, 적대적 이중 디코더와 "두 번 보기"로 작은 위장 객체까지 잡는 비지도 COD.
pubDate: 2026-03-26 09:00:00 +0900
category: paper-review
tags: [cod, unsupervised]
takeaways:
  - 기존 비지도 COD는 고정 전략으로 만든 잡음 많은 의사 라벨을 그대로 믿고, 1×1 합성곱 하나짜리 단순한 디코더를 써서 성능이 낮았다.
  - 적응형 의사 라벨 모듈(APM)이 고정 전략과 교사 모델의 라벨을 섞어 잘못된 지식에 과적합되는 것을 막는다.
  - 이중 분기 적대적 디코더(DBA)가 전경-배경 혼동을 줄이고, Look-Twice 메커니즘이 작은 객체를 한 번 더 확대해 다듬는다.
paper:
  title: 'UCOD-DPL: Unsupervised Camouflaged Object Detection via Dynamic Pseudo-label Learning'
  authors: Weiqi Yan, Lvhai Chen, Huaijia Kou, Shengchuan Zhang, Yan Zhang, Liujuan Cao
  venue: CVPR 2025
  year: 2025
  url: https://openaccess.thecvf.com/content/CVPR2025/html/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2025/papers/Yan_UCOD-DPL_Unsupervised_Camouflaged_Object_Detection_via_Dynamic_Pseudo-label_Learning_CVPR_2025_paper.pdf
  code: https://github.com/Heartfirey/UCOD-DPL
---

## 문제

비지도 위장 객체 탐지(UCOD)는 픽셀 단위 라벨이 필요 없어 주목받고 있다. 하지만 기존 방법들은 보통 **고정된 전략**으로 의사 라벨을 만들고, **1×1 합성곱 층** 하나를 단순한 디코더로 학습해서 완전 지도 방법보다 성능이 크게 낮았다. 저자들은 두 가지 문제를 짚는다.

1. 의사 라벨에 잡음이 많아서, 모델이 잘못된 지식에 맞춰지기 쉽다.
2. 단순한 디코더는 위장 객체의 의미 특징을 잡지 못한다. 의사 라벨의 해상도가 낮고 전경과 배경 픽셀이 심하게 섞여 있어, 특히 작은 객체에서 그렇다.

## 방법

교사-학생(teacher-student) 구조에서 의사 라벨을 동적으로 학습하는 UCOD-DPL을 제안한다.

### 적응형 의사 라벨 모듈 (APM)

고정 전략으로 만든 의사 라벨과 **교사 모델**이 만든 의사 라벨을 적응적으로 섞는다. 고정 라벨의 잡음에 과적합되는 것을 막으면서, 모델이 학습 중에 스스로 라벨을 고쳐 나갈 여지를 남긴다.

### 이중 분기 적대적 디코더 (DBA)

서로 다른 분할 목표를 두 분기가 적대적으로 학습하게 해, 위장 객체에서 흔한 전경-배경 혼동을 극복하도록 이끈다.

### Look-Twice

사람이 위장 객체를 볼 때 확대해서 다시 보는 습관을 흉내 낸다. 작은 객체는 한 번 더 확대해 **2차로 다듬는다.**

## 실험

뛰어난 성능을 보였고, 일부 기존 완전 지도 방법보다도 좋았다고 보고했다.

## 정리

비지도 COD의 성능이 낮은 이유를 "라벨의 잡음"과 "디코더의 빈약함" 두 가지로 나눠, 각각에 대응하는 모듈을 붙인 구성이 명확하다. Look-Twice는 SegMaR나 ZoomNet의 확대 아이디어가 비지도 설정에서도 유효하다는 것을 보여 준다.

교사 모델의 라벨을 섞는 방식은 교사가 틀린 방향으로 굳어지면 오류가 오히려 강화될 수 있으므로, APM이 그 균형을 어떻게 잡는지가 관건이다.
