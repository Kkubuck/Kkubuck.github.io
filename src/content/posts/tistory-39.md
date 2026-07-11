---
title: Activating More Pixels in Image Super-Resolution Transformer
description: HAT은 창 기반 Transformer가 실제로 참고하는 입력 범위가 좁다는 관찰에서 출발해 채널·공간 주의를 함께 확장한다.
summary: HAT은 창 기반 Transformer가 실제로 참고하는 입력 범위가 좁다는 관찰에서 출발해 채널·공간 주의를 함께 확장한다.
subtitle: HAT은 창 기반 Transformer가 실제로 참고하는 입력 범위가 좁다는 관찰에서 출발해 채널·공간 주의를 함께 확장한다.
pubDate: 2023-11-16 22:32:29 +0900
slug: tistory-39
kind: paper
lang: ko
tags:
- paper
- super-resolution
- transformer
- image-restoration
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2023/html/Chen_Activating_More_Pixels_in_Image_Super-Resolution_Transformer_CVPR_2023_paper.html
sourceBlog: tistory
legacyUrl: https://jms3084.tistory.com/39
venue: CVPR 2023
paperYear: 2023
authors: Xiangyu Chen, Xintao Wang, Jiantao Zhou, Yu Qiao, Chao Dong
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2023/papers/Chen_Activating_More_Pixels_in_Image_Super-Resolution_Transformer_CVPR_2023_paper.pdf
codeUrl: https://github.com/XPixelGroup/HAT
doi: 10.48550/arXiv.2205.04437
takeaways:
- 모델의 이론적 수용영역보다 실제 출력에 기여하는 입력 픽셀의 범위가 더 중요하다.
- HAT은 window self-attention, channel attention, overlapping cross-attention을 역할별로 조합한다.
- 큰 성능 향상에는 구조뿐 아니라 같은 과제의 사전학습과 모델 스케일 증가도 함께 기여한다.
---

## “Transformer는 멀리 본다”를 다시 묻기

이미지 복원에서 Transformer를 쓰는 대표적 이유는 넓은 문맥을 다룰 수 있다는 기대다. HAT 논문은 이 기대가 실제 네트워크 동작과 항상 일치하는지부터 확인한다. 저자들은 attribution 분석을 통해 기존 SR Transformer가 출력 픽셀을 복원할 때 입력의 제한된 공간만 활용하는 경향을 보인다고 지적한다. 창 기반 self-attention이 계산량을 줄이는 대신, 창 밖 정보의 흐름을 약하게 만들 수 있다는 이야기다.

논문의 제목인 “Activating More Pixels”는 레이어 수를 늘린다는 뜻이 아니다. 최종 출력에 실질적으로 기여하는 입력 픽셀의 범위를 넓히겠다는 목표다. 이 문제 정의가 HAT의 각 모듈을 이해하는 가장 좋은 출발점이다.

## Hybrid Attention Block

HAT은 window-based self-attention과 channel attention을 같은 블록 안에서 결합한다. 창 기반 주의는 지역 패턴을 정밀하게 맞추는 데 강하고, 채널 주의는 공간 전체에서 집계된 통계를 이용해 어떤 특징 채널을 강조할지 결정한다. 둘은 중복이라기보다 서로 다른 축을 담당한다.

채널 주의가 곧 전역 공간 관계를 직접 계산하는 것은 아니다. 대신 전체 영상에서 요약된 통계를 통해 지역 창 안의 계산을 보정한다. 따라서 HAT의 핵심을 “두 종류의 attention을 많이 넣었다”로 읽기보다, 지역 적합성과 전역 통계를 비용 안에서 함께 쓰려는 설계로 보는 편이 정확하다.

## 창 사이의 단절을 줄이는 OCAB

Overlapping Cross-Attention Block은 이웃 창의 특징을 겹치는 키·값 영역으로 가져온다. 일반적인 비중첩 창은 경계에 걸친 패턴을 서로 다른 그룹으로 분리하기 쉽다. OCAB은 질의 창보다 넓은 주변을 참조하게 해 창 경계에서 끊긴 선이나 반복 텍스처를 연결한다.

이 모듈은 전체 해상도에 전역 attention을 적용하는 것보다 저렴하면서, shift만으로 창을 섞는 방식과 다른 상호작용을 제공한다. 실제 구현을 볼 때는 overlap 크기와 해상도에 따른 메모리 증가를 함께 확인해야 한다.

## 구조 외에 함께 봐야 할 것

논문은 같은 SR 과제에서 사전학습한 모델을 활용하는 전략과 모델 스케일 확장도 사용한다. 따라서 최종 성능을 HAT 블록 하나의 효과로만 해석하면 과장될 수 있다. ablation에서 채널 주의, 겹침 cross-attention, 사전학습이 각각 얼마나 기여하는지 분리해 보는 것이 중요하다.

또한 높은 PSNR을 얻는 대형 모델은 학습 자원과 추론 메모리가 크다. 공개 코드가 tile inference를 제공하는 것도 이 현실적인 제약 때문이다. 작은 이미지 벤치마크의 숫자와 고해상도 실제 영상의 처리 비용은 별도 문제다.

## 읽고 남은 판단

HAT이 남긴 가장 좋은 질문은 “이 네트워크가 이론적으로 볼 수 있는가”가 아니라 “실제로 어느 픽셀을 사용했는가”이다. 구조 비교에서 FLOPs와 파라미터만 보던 시선을 입력 기여 범위로 옮겼다는 점이 중요하다. 이후 SR Transformer를 읽을 때도 attention 이름보다 창 사이 정보가 어떻게 이동하고, 그 이동이 실제 복원에 쓰이는지를 확인하게 만든다.
