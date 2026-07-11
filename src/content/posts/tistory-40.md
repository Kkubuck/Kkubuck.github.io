---
title: Open-Vocabulary Semantic Segmentation with Mask-adapted CLIP
description: OVSeg는 마스크 영역을 분류할 때 CLIP이 급격히 약해지는 병목을 찾아, 데이터와 프롬프트 양쪽에서 입력 분포를 맞춘다.
summary: OVSeg는 마스크 영역을 분류할 때 CLIP이 급격히 약해지는 병목을 찾아, 데이터와 프롬프트 양쪽에서 입력 분포를 맞춘다.
subtitle: OVSeg는 마스크 영역을 분류할 때 CLIP이 급격히 약해지는 병목을 찾아, 데이터와 프롬프트 양쪽에서 입력 분포를 맞춘다.
pubDate: 2024-02-15 13:25:06 +0900
slug: tistory-40
kind: paper
lang: ko
tags:
- paper
- open-vocabulary
- semantic-segmentation
- clip
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2023/html/Liang_Open-Vocabulary_Semantic_Segmentation_With_Mask-Adapted_CLIP_CVPR_2023_paper.html
sourceBlog: tistory
legacyUrl: https://jms3084.tistory.com/40
venue: CVPR 2023
paperYear: 2023
authors: Feng Liang 외 8명
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2023/papers/Liang_Open-Vocabulary_Semantic_Segmentation_With_Mask-Adapted_CLIP_CVPR_2023_paper.pdf
codeUrl: https://github.com/facebookresearch/ov-seg
doi: 10.48550/arXiv.2210.04150
takeaways:
- 두 단계 open-vocabulary segmentation의 병목은 mask proposal보다 마스킹된 영상을 분류하는 CLIP 쪽에 있었다.
- 정확하지만 닫힌 클래스의 라벨보다 noisy하더라도 다양한 caption 기반 데이터가 일반화에 유리할 수 있다.
- mask prompt tuning은 빈 영역을 버리지 않고 학습 가능한 문맥으로 바꾼다.
---

## 어디에서 성능이 막히는지 먼저 확인한 논문

두 단계 open-vocabulary segmentation은 대체로 class-agnostic mask를 만든 뒤, 각 마스크 영역을 CLIP으로 분류한다. 얼핏 보면 마스크 품질이 가장 큰 병목처럼 보인다. OVSeg는 이 가정을 실험으로 뒤집는다. 마스크 제안이 완벽하다고 가정해도 일반 CLIP 분류기의 성능이 충분히 오르지 않는 반면, 분류가 완벽하다고 가정하면 전체 성능이 크게 올라간다는 분석을 제시한다.

원인은 입력 분포 차이다. CLIP은 자연스러운 전체 이미지와 텍스트 쌍으로 학습됐지만, 실제 추론에서는 객체 주변이 잘리고 나머지가 비어 있는 마스크 이미지를 받는다. 객체 모양은 남아 있어도 배경 문맥과 이미지 통계가 달라진다. OVSeg의 설계는 이 간극을 줄이는 데 집중한다.

## 마스크-텍스트 학습 데이터를 만드는 방식

가장 직접적인 방법은 semantic segmentation 데이터의 정확한 마스크와 클래스 라벨로 CLIP을 미세조정하는 것이다. 그러나 고정된 클래스 수가 작은 데이터만 사용하면 open vocabulary 일반화가 약해질 수 있다. 저자들은 COCO Captions 같은 이미지-캡션 데이터에서 명사를 추출하고, class-agnostic proposal과 CLIP 매칭을 이용해 마스크-텍스트 쌍을 만든다.

이 과정에서 만들어진 라벨은 수작업 segmentation보다 noisy하다. 대신 표현되는 단어와 시각 개념의 범위가 넓다. 논문의 흥미로운 관찰은 **정확도와 어휘 다양성이 항상 같은 방향으로 움직이지 않는다**는 점이다. 미지 클래스 일반화를 목표로 할 때는 조금 거친 라벨이라도 풍부한 언어 분포를 유지하는 것이 더 나을 수 있다.

## Mask Prompt Tuning

마스크 이미지의 빈 영역을 0이나 고정 색으로 두면 CLIP이 학습 때 보지 못한 강한 패턴이 생긴다. OVSeg는 이 빈 영역을 학습 가능한 prompt로 채운다. 객체 픽셀은 유지하고, 가려진 위치에는 최적화 가능한 값을 사용해 CLIP 입력을 작업에 맞춘다.

이 방식은 CLIP 전체 가중치를 바꾸지 않아도 적용할 수 있고, 전체 미세조정과 함께 사용할 수도 있다. 텍스트 prompt가 문장을 조정한다면 mask prompt는 **이미지의 결손 문맥을 조정하는 시각적 prompt**라고 볼 수 있다.

## 실험에서 읽어야 할 부분

논문의 강한 결과만큼 중요한 것은 병목 분석과 데이터 ablation이다. 정확한 closed-set 라벨로 학습했을 때와 noisy caption 데이터로 학습했을 때, seen·unseen 클래스 성능이 어떻게 바뀌는지를 같이 봐야 한다. 또한 two-stage pipeline의 전체 성능은 proposal generator의 품질과 후보 수에도 영향을 받으므로, CLIP 적응 효과가 모든 segmentation 설정에 그대로 옮겨진다고 단정하기는 어렵다.

## 한계와 확장 가능성

마스크-명사 자동 매칭에는 초기 CLIP 편향이 들어간다. caption에 언급되지 않은 객체, 작은 객체, 추상적 클래스는 학습 쌍에서 빠질 수 있다. 두 단계 구조는 proposal마다 분류해야 하므로 계산 비용도 커진다. 이후 end-to-end open-vocabulary segmentation이 발전하면서 구조 자체는 달라졌지만, **사전학습 모델이 실제 downstream 입력 형태를 본 적이 있는가**라는 질문은 계속 남는다.

## 읽고 남은 판단

OVSeg는 큰 모델을 가져다 쓰는 것보다 먼저 입력 분포를 확인해야 한다는 좋은 사례다. CLIP이 자연 이미지에서는 강하다는 사실과, 잘린 마스크 영역에서도 강하다는 결론은 같지 않다. 이 차이를 진단하고 데이터 구성과 prompt tuning으로 직접 보정했다는 점이 논문의 핵심이다.
