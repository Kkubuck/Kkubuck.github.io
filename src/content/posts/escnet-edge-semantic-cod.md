---
title: 'ESCNet: Edge-Semantic Collaborative Network for Camouflaged Object Detection'
description: AETP가 edge–texture를 공동 인식하고, DSFA가 local complexity와 orientation에 맞춰 sampling하며, MFMM이 계층 특징을 점진적으로
  보정한다.
summary: AETP가 edge–texture를 공동 인식하고, DSFA가 local complexity와 orientation에 맞춰 sampling하며, MFMM이 계층 특징을 점진적으로 보정한다.
subtitle: 경계를 semantic의 보조 출력으로 한 번 쓰고 버리지 않고, edge perception과 texture prediction이 서로 갱신되는 feedback loop로 묶어 fractal
  boundary와 불규칙 질감을 다룬 ESCNet.
pubDate: 2026-03-30 09:00:00 +0900
slug: escnet-edge-semantic-cod
kind: paper
lang: ko
tags:
- paper
- cod
- edge-texture
- dynamic-sampling
- iccv-2025
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2025/html/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.html
venue: ICCV 2025
paperYear: 2025
authors: Sheng Ye, Xin Chen, Yan Zhang, Xianming Lin, Liujuan Cao
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2025/papers/Ye_ESCNetEdge-Semantic_Collaborative_Network_for_Camouflaged_Object_Detection_ICCV_2025_paper.pdf
codeUrl: https://github.com/suy9/ESCNet
takeaways:
- edge와 texture를 독립 branch로 병렬 처리하지 않고 서로 강화하는 순환 관계로 모델링한다.
- DSFA는 경계 방향과 texture 복잡도에 따라 kernel sampling 위치를 바꿔 고정 grid의 한계를 줄인다.
- edge–semantic feedback가 잘못된 texture edge를 증폭하지 않는지, 단순 deformable convolution 대비 이득을 확인해야 한다.
---

## 경계와 질감은 서로를 설명한다

위장 객체의 경계는 색 대비가 아니라 texture 흐름이 끊기는 방식으로 드러나는 경우가 많다. 반대로 어떤 texture가 객체에 속하는지 알려면 대략적인 경계와 global semantic이 필요하다. ESCNet은 edge와 texture를 두 개의 독립 보조 신호로 두지 않고 **서로 피드백하는 시스템**으로 만든다.

단일 modality feature가 fragmented mask를 만드는 이유를 boundary constraint 부족으로 보고, local edge–texture와 transformer의 global context를 함께 사용한다.

## Adaptive Edge-Texture Perceptor

**AETP**는 multi-scale image feature와 transformer global semantic을 받아 edge와 texture를 동시에 인식한다. local gradient만 보면 나뭇잎 맥이나 바위 균열을 객체 경계로 오인하기 쉽다. global object context가 어떤 edge가 의미 있는지 걸러 준다.

반대로 semantic map이 객체를 넓게 뭉개면 edge cue가 세부 윤곽을 되돌린다. 한쪽이 고정된 teacher가 아니라 두 표현이 반복적으로 보완되는 것이 특징이다.

## Dual-Stream Feature Augmentor

일반 convolution은 고정된 정사각 grid에서 sample한다. 하지만 위장 객체의 경계는 굴곡이 심하고 texture 방향도 불규칙하다. **DSFA**는 local texture complexity와 edge orientation에 따라 kernel sampling position을 동적으로 조정한다.

복잡한 경계에서는 더 적절한 방향의 이웃을 모으고, 균일한 영역에서는 불필요한 sampling을 줄일 수 있다. 두 stream이 edge와 semantic 관점의 feature를 각각 강화한 뒤 상호 교환한다.

## Multi-Feature Modulation

**MFMM**은 여러 계층의 texture와 edge representation을 통합해 feature calibration과 prediction을 점진적으로 개선한다. 얕은 edge와 깊은 semantic을 한 번에 concat하기보다, 현재 edge perception이 texture prediction을 고치고 개선된 texture가 다시 edge를 정교하게 만드는 incremental refinement다.

이 feedback loop가 논문의 중심 주장이다. 모듈 이름 세 개보다 정보가 어느 방향으로 순환하고 어느 단계에서 supervision을 받는지를 보는 편이 구조를 이해하기 쉽다.

## 실험에서 필요한 검증

세 표준 COD dataset의 평균 지표만으로 edge–texture collaboration을 입증하기는 부족하다. 복잡한 털, 잎, 그물, fractal-like boundary subset에서 일반 모델보다 실제로 좋아지는지, false texture edge는 줄어드는지 확인해야 한다.

절제에서는 AETP, DSFA, MFMM을 하나씩 제거하고, 고정 convolution 또는 일반 deformable convolution과 DSFA를 비교해야 한다. edge ground truth 생성 방식과 추가 supervision 비용도 명시되어야 공정하다.

## 장점과 한계

ESCNet은 boundary를 마지막 cosmetic refinement가 아니라 semantic recognition의 구성 요소로 본다. 이 관점은 얇은 구조가 중요한 의료·원격탐사 segmentation에도 유용하다.

하지만 feedback은 오류도 순환시킬 수 있다. 배경의 강한 texture를 edge로 잘못 잡으면 semantic branch가 그 영역을 객체로 강화하고, 다시 더 강한 edge가 만들어질 수 있다. uncertainty gate나 오류 억제 장치가 없다면 domain shift에서 취약할 수 있다. 동적 sampling의 메모리 접근 비용도 실제 속도에서 확인해야 한다.
