---
title: Frequency-Spatial Entanglement Learning for Camouflaged Object Detection
description: FSEL은 ETB의 Frequency Self-Attention과 Entanglement FFN, Joint Domain Perception, Dual-domain Reverse
  Parser로 두 도메인을 깊게 상호작용시킨다.
summary: FSEL은 ETB의 Frequency Self-Attention과 Entanglement FFN, Joint Domain Perception, Dual-domain Reverse Parser로
  두 도메인을 깊게 상호작용시킨다.
subtitle: frequency와 spatial branch를 마지막에 단순 융합하지 않고, transformer block 내부에서 attention과 feed-forward를 통해 반복적으로 얽어
  두 표현의 상호 보완을 학습한 FSEL.
pubDate: 2026-03-21 09:00:00 +0900
slug: fsel-cod-eccv2024
kind: paper
lang: ko
tags:
- paper
- cod
- frequency-spatial
- transformer
- eccv-2024
categories:
- papers
sourceUrl: https://eccv.ecva.net/virtual/2024/poster/1899
venue: ECCV 2024
paperYear: 2024
authors: Yanguang Sun, Chunyan Xu, Jian Yang, Hanyu Xuan, Lei Luo
reviewedOn: '2026-07-10'
pdfUrl: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/01899.pdf
codeUrl: https://github.com/CSYSI/FSEL
takeaways:
- frequency와 spatial 정보를 두 독립 branch의 late fusion으로 취급하지 않고 블록 내부에서 계속 교환한다.
- FSA는 주파수 대역 관계를, EFFN은 두 도메인의 local interaction을, JDPM·DRF는 의미 강화와 역방향 통합을 맡는다.
- 모듈 수가 많아 각 구성의 독립적 필요성과 계산 대비 이득을 절제 실험으로 꼼꼼히 봐야 한다.
---

## 두 도메인을 마지막에 합치면 늦다

frequency-aware COD 모델은 보통 spatial branch와 frequency branch를 따로 계산한 뒤 decoder에서 합친다. 이 방식은 명확하지만, 각 branch가 상대 도메인의 정보를 모른 채 표현을 굳힐 수 있다. FSEL은 **entanglement**, 즉 두 도메인이 표현을 만드는 중간부터 계속 영향을 주도록 설계한다.

spatial feature는 위치와 형태를 잘 보존하지만 객체·배경의 픽셀 유사성에 약하다. frequency feature는 반복 질감과 급격한 변화를 드러내지만 위치 의미가 흐려질 수 있다. 둘을 깊게 얽으면 한쪽의 약점을 다른 쪽이 학습 단계마다 보완할 수 있다는 가정이다.

## Entanglement Transformer Block

FSEL의 기본 단위인 **ETB**에는 Frequency Self-Attention(FSA)과 Entanglement Feed-Forward Network(EFFN)가 들어간다. FSA는 서로 다른 frequency band 사이의 관계를 모델링해 어떤 대역 조합이 위장 단서를 드러내는지 찾는다. 특정 고주파만 키우는 단순 필터보다 장면에 따라 대역 상호작용을 바꿀 수 있다.

EFFN은 spatial과 frequency feature를 local operation 안에서 섞는다. attention이 전역·대역 관계를 다룬다면 feed-forward는 가까운 위치의 세부를 교환한다. transformer block의 두 핵심 경로 모두에 dual-domain interaction을 넣은 셈이다.

## JDPM과 Dual-domain Reverse Parser

여러 ETB를 지난 특징은 **Joint Domain Perception Module(JDPM)**에서 semantic을 강화한다. 두 도메인이 공통으로 지지하는 객체 후보를 모으고, 한쪽에만 강하게 나타나는 noise를 줄이는 역할이다.

마지막 **Dual-domain Reverse Parser(DRF)**는 고수준 예측을 이용해 낮은 수준의 두 도메인 특징을 역방향으로 해석하고 통합한다. 거친 객체 위치가 정해진 뒤, spatial edge와 frequency detail을 다시 조회해 경계를 복원하는 top-down refinement로 볼 수 있다.

## 결과에서 볼 것

논문은 세 주요 COD 데이터셋에서 21개 기존 방법과 비교한다. 평균 성능 외에 중요한 것은 기존 frequency method 대비 개선이 어디서 생기는지다. ETB만으로도 좋아지는지, JDPM과 DRF가 각각 다른 오류를 줄이는지, spatial-only와 frequency-only branch의 실패가 실제로 상보적인지 시각화해야 주장에 힘이 생긴다.

frequency 연구는 입력 변환과 backbone 차이가 결과에 큰 영향을 줄 수 있다. 같은 학습 설정과 입력 크기에서 late-fusion baseline을 두고 entanglement의 순수 효과를 비교하는 것이 특히 중요하다.

## 흐름 속에서 읽기

FDCOD이 frequency clue를 본격적으로 도입했고 FEDER가 learnable band decomposition을 발전시켰다면, FSEL은 **도메인 간 상호작용의 깊이**를 밀어붙인다. 무엇을 변환할지뿐 아니라 spatial과 frequency가 언제, 어느 연산에서 만날지가 설계 변수가 된다.

이 원칙은 RGB-depth, RGB-thermal 같은 multimodal fusion에도 통한다. 각 modality를 끝까지 독립 처리할지, 초기부터 얽을지, 의미 수준에서만 결합할지는 정보 상보성과 noise 특성에 따라 달라진다.

## 비판할 지점

ETB, JDPM, DRF가 모두 추가되면서 구조가 복잡해진다. 각 이름이 다른 모듈이라고 해서 항상 독립적인 기능을 가진 것은 아니다. 파라미터를 맞춘 단순 cross-attention과의 비교, 센서·압축 변화에서 frequency branch의 안정성, 고해상도 추론 비용을 확인해야 한다. 또한 얽힘이 너무 강하면 한 도메인의 artifact가 다른 도메인 전체로 퍼질 수 있다.
