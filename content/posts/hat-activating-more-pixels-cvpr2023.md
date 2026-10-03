---
title: 'HAT: Activating More Pixels in Image Super-Resolution Transformer'
description: 기존 초해상도 트랜스포머가 실제로는 좁은 범위의 입력만 쓴다는 분석에서 출발해, 채널 어텐션과 윈도 셀프 어텐션을 결합한 HAT를 제안한다.
pubDate: 2023-11-16 22:32:29 +0900
category: paper-review
tags: [super-resolution, transformer]
takeaways:
  - 귀속 분석(attribution analysis)으로 보면, 기존 초해상도 트랜스포머는 입력의 제한된 공간 범위만 활용한다.
  - 전역 통계를 쓰는 채널 어텐션과 지역 적합에 강한 윈도 셀프 어텐션을 결합하고, 겹치는 교차 어텐션으로 이웃 윈도 사이의 정보 교환을 늘린다.
  - 같은 작업으로의 사전학습과 모델 확장까지 더해, 기존 최고 성능보다 1dB 이상 높은 결과를 냈다.
paper:
  title: Activating More Pixels in Image Super-Resolution Transformer
  authors: Xiangyu Chen, Xintao Wang, Jiantao Zhou, Yu Qiao, Chao Dong
  venue: CVPR 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/CVPR2023/html/Chen_Activating_More_Pixels_in_Image_Super-Resolution_Transformer_CVPR_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2023/papers/Chen_Activating_More_Pixels_in_Image_Super-Resolution_Transformer_CVPR_2023_paper.pdf
  code: https://github.com/XPixelGroup/HAT
origin:
  name: Tistory
  url: https://jms3084.tistory.com/39
---

## 문제

트랜스포머 기반 방법은 초해상도 같은 저수준 비전 작업에서 좋은 성능을 보여 왔다. 트랜스포머를 쓰는 대표적인 이유는 넓은 문맥을 볼 수 있다는 기대다. 그런데 저자들이 귀속 분석(attribution analysis)으로 확인해 보니, 기존 네트워크는 출력 픽셀을 복원할 때 **입력의 제한된 공간 범위**만 활용하고 있었다. 트랜스포머의 잠재력이 아직 충분히 쓰이지 않고 있다는 뜻이다.

제목의 "Activating More Pixels"는 층을 더 쌓는다는 뜻이 아니다. 최종 출력에 실제로 기여하는 입력 픽셀의 범위를 넓히겠다는 목표다.

## 방법

### Hybrid Attention Transformer (HAT)

두 종류의 어텐션을 결합해 서로의 장점을 살린다.

- **채널 어텐션**: 영상 전체에서 모은 전역 통계로 어떤 채널을 강조할지 정한다.
- **윈도 기반 셀프 어텐션**: 윈도 안에서 지역 패턴을 정밀하게 맞춘다.

채널 어텐션이 전역 공간 관계를 직접 계산하는 것은 아니지만, 전역 통계로 지역 윈도 안의 계산을 보정해 준다.

### 겹치는 교차 어텐션 (OCAB)

일반적인 윈도는 서로 겹치지 않아서, 윈도 경계에 걸친 패턴이 다른 그룹으로 나뉜다. Overlapping Cross-Attention Block은 질의 윈도보다 넓은 주변 영역을 키·값으로 참조해 **이웃 윈도 특징 사이의 상호작용**을 늘린다. 윈도 경계에서 끊긴 선이나 반복 질감을 잇는 역할이다.

### 같은 작업 사전학습

학습 단계에서 같은 초해상도 작업으로 대규모 사전학습을 먼저 하는 전략을 써서, 모델의 잠재력을 더 끌어낸다. 모델 크기도 키워 이 작업의 성능이 크게 오를 수 있음을 보였다.

## 실험

제안한 모듈들의 효과를 확인했고, 전체 방법은 기존 최고 성능보다 1dB 이상 높았다.

## 정리

"이 네트워크가 이론적으로 볼 수 있는가"가 아니라 "**실제로 어느 픽셀을 썼는가**"를 물었다는 점이 가장 인상적이다. 구조를 비교할 때 FLOPs와 파라미터만 보던 시선을 입력 기여 범위로 옮겨 준다.

다만 최종 성능 향상에는 블록 구조뿐 아니라 사전학습과 모델 확장도 함께 기여하므로, 성능을 HAT 블록 하나의 효과로만 읽으면 과장된다. 큰 모델은 학습 자원과 추론 메모리도 많이 필요해서, 공개 코드가 타일 추론을 따로 제공하는 이유이기도 하다.
