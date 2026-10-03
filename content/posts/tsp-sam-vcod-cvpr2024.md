---
title: 'Endow SAM with Keen Eyes: Temporal-spatial Prompt Learning for Video Camouflaged Object Detection'
description: 사람이 프롬프트를 주지 않아도 영상의 미세한 움직임으로 SAM의 프롬프트를 스스로 만들어, 영상 속 위장 객체를 분할하는 TSP-SAM.
pubDate: 2026-03-19 09:00:00 +0900
category: paper-review
tags: [cod, video, sam]
takeaways:
  - SAM을 영상 위장 객체 탐지에 쓰기 어려운 이유는 시공간 관계를 무시하고, 눈으로 찾기 어려운 대상에 사용자 프롬프트를 믿을 수 없기 때문이다.
  - 연속 프레임의 미세한 움직임으로 객체를 잡아 프롬프트를 스스로 만들고(motion-driven self-prompt), 긴 구간의 일관성으로 프롬프트의 편향을 줄인다.
  - MoCA-Mask와 CAD2016에서 mIoU를 각각 7.8%, 9.6% 끌어올렸다.
paper:
  title: 'Endow SAM with Keen Eyes: Temporal-spatial Prompt Learning for Video Camouflaged Object Detection'
  authors: Wenjun Hui, Zhenfeng Zhu, Shuai Zheng, Yao Zhao
  venue: CVPR 2024
  year: 2024
  url: https://openaccess.thecvf.com/content/CVPR2024/html/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2024/papers/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.pdf
  code: https://github.com/WenjunHui1/TSP-SAM
---

## 문제

Segment Anything Model(SAM)은 프롬프트를 받아 자연 이미지를 잘 분할하는 기반 모델이다. 하지만 영상 위장 객체 탐지(VCOD)에 그대로 쓰기에는 두 가지 문제가 있다.

- **시공간 관계를 무시한다.** SAM은 이미지 한 장 단위로 동작해, 프레임 사이의 움직임 단서를 쓰지 못한다.
- **사용자 프롬프트를 믿을 수 없다.** 위장 객체는 사람 눈으로도 찾기 어려워서, 사람이 찍어 주는 점이나 박스 자체가 부정확하다.

## 방법

TSP-SAM(Temporal-spatial Prompt SAM)은 프롬프트 학습 방식을 바꿔 SAM에 "예리한 눈"을 달아 준다.

### 움직임 기반 자기 프롬프트

연속된 프레임 사이의 **미세한 움직임 단서**로 위장 객체를 잡아, 프롬프트를 스스로 만든다(motion-driven self-prompt learning). 사용자가 프롬프트를 줄 필요가 없고, 객체 전체의 움직임을 포착해 공간 위치를 더 정확하게 잡는다.

### 장기 일관성으로 프롬프트 보정

프레임 사이가 끊기면 프롬프트가 한쪽으로 치우칠 수 있다. 영상 전체의 **장기 일관성**(long-range consistency)을 고려해 자기 프롬프트를 더 견고하게 만든다. 이 정보는 SAM의 인코더에도 주입해 표현력을 높인다.

## 실험

두 벤치마크(MoCA-Mask, CAD2016)에서 기존 최고 성능 대비 mIoU가 각각 7.8%, 9.6% 올랐다. 공개 저장소의 분석에 따르면, SAM에는 마스크와 점을 조합한 프롬프트보다 **마스크와 박스**를 조합한 프롬프트가 더 안정적이었다. 점은 위장 객체의 약한 경계 정보를 전달하기 어렵기 때문이다.

## 정리

SAM 기반 COD 연구의 공통 과제인 "프롬프트를 어디서 얻을 것인가"에, 영상이라면 **움직임에서 얻으면 된다**는 답을 준 논문이다. SLT-Net이 상관 볼륨으로 움직임을 다뤘다면, TSP-SAM은 같은 움직임 단서를 SAM의 프롬프트로 바꿨다는 점에서 이어 읽기 좋다.

움직임이 거의 없는 구간에서는 자기 프롬프트가 약해지고, 프레임마다 SAM을 돌리는 만큼 계산 비용도 크다.
