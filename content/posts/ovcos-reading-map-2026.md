---
title: 'OVCOS 읽기 지도: 2026년에 이어 읽을 연구들'
description: OVCoser와 SuCLIP 다음에 읽을 개방 어휘 위장 객체 분할(OVCOS) 논문들을 의미 정렬, 학습 없는 추론, 인스턴스 분할 세 갈래로 묶었다.
pubDate: 2026-10-02 18:00:00 +0900
category: research-note
tags: [cod, open-vocabulary]
---

[OVCoser](/posts/ovcos-ovcoser-eccv2024/)와 [SuCLIP](/posts/seeing-the-unseen-suclip/) 리뷰 다음으로 읽을 논문을 정리했다. 묶는 기준은 **위장 객체의 위치를 찾는 문제와 이름을 붙이는 문제가 어디서 만나는가**다. 원문 초록과 출판 정보를 바탕으로 만든 목록이고, 실험을 재현하거나 성능 순위를 매긴 것은 아니다. 확인 기준일은 2026년 10월 2일이다.

## 1. 의미를 전달하는 경로

- **OVCoser** (ECCV 2024): 고정된 CLIP에 의미 안내와 경계·깊이 같은 구조 단서를 더한 기준 모델.
- **SuCLIP** (ICCV 2025): 맥락 인식 프롬프트와 의미 정렬로 위장 장면의 의미 혼동을 줄인다.
- **BaCLIP** (CVPR 2026): 시각 특징과 텍스트 특징을 양방향으로 정렬하고, 그 결과를 SAM의 프롬프트로 넘긴다. 백본과 추가 모델이 다르면 성능 차이를 정렬 방식 하나로 설명할 수 없다는 점을 염두에 두고 읽는다. [원문](https://openaccess.thecvf.com/content/CVPR2026/html/Zhang_Seeing_Both_Sides_Towards_Bidirectional_Semantic_Alignment_for_Open-Vocabulary_Camouflaged_CVPR_2026_paper.html)
- **Cascaded VLMs** (Computational Visual Media, 2026): 전체 이미지로 학습한 표현을 잘라 낸 영역에 적용할 때의 차이와, 위장 객체의 약한 경계를 문제로 삼는다. 분류와 분할을 어떤 순서로 하고, 앞 단계의 오류가 뒤로 어떻게 넘어가는지를 먼저 정리할 생각이다. [원문](https://doi.org/10.26599/CVM.2025.9450512)

## 2. 추가 학습이 없는 경우

- **Training-Free OVCOS** (CVPR 2026): 객체와 배경의 세밀한 설명, 패치 사이의 관계를 이용해 추가 학습 없이 OVCOS를 푼다. 감독 신호의 양뿐 아니라 설명 생성과 추론에 드는 비용도 함께 봐야 한다. "같은 모델, 같은 입력 조건에서도 이득이 남는가"가 비교 질문이다. [원문](https://openaccess.thecvf.com/content/CVPR2026/html/Ren_Training-Free_Open-Vocabulary_Camouflaged_Object_Segmentation_via_Fine-Grained_Object_Binding_and_CVPR_2026_paper.html)

인접 연구로는 일반 개방 어휘 분할의 CAT-Seg(CVPR 2024), CLIPSelf(ICLR 2024), ProxyCLIP(ECCV 2024), CorrCLIP(CVPR 2025)을 함께 읽는다. 이 논문들의 목표는 일반 장면의 조밀 예측이므로, 해당 벤치마크의 결과를 OVCOS의 결과로 바로 옮겨 읽지 않는다. 지역 특징과 공간 관계를 만드는 방식부터 비교한다.

## 3. 인스턴스 단위로 넘어가기

- **Catch Me If You Can Describe Me** (IJCV 2026): 확산 모델의 표현과 텍스트 특징으로 위장 객체를 인스턴스 단위로 나눈다. OVCOS와 이어지지만 출력과 평가 단위가 다르다. 여러 개체가 붙어 있을 때 하나의 마스크로 합쳐지는 오류를 따로 볼 필요가 있다. [원문](https://link.springer.com/article/10.1007/s11263-026-02804-4)
- 함께 읽을 것: 확산 모델 기반 개방 어휘 분할인 ODISE(CVPR 2023), 위장 인스턴스 분할의 [DCNet](/posts/dcnet-cis-cvpr2023/)(CVPR 2023).

## 읽을 순서

1. OVCoser → SuCLIP → BaCLIP: 의미 정보가 전달되는 경로
2. Cascaded VLMs: 분류와 분할의 순서
3. Training-Free OVCOS: 감독 조건과 추론 비용
4. Catch Me If You Can Describe Me → ODISE → DCNet: 인스턴스 분리와 평가 단위

2026년 9월에 공개된 [ViCo-SAM3](https://arxiv.org/abs/2609.15418)는 후속 동향으로 남겨 둔다. 확인 시점 기준으로 프리프린트라서 학회·저널 논문과 구분했다. 논문들을 비교할 때 맞춰야 할 조건은 [OVCOS 비교표를 만들기 전에 고정할 것들](/posts/ovcos-comparison-protocol/)에 정리했다.
