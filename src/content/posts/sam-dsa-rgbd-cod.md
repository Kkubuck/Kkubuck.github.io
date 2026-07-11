---
title: Improving SAM for Camouflaged Object Detection via Dual Stream Adapters
description: SAM-DSA는 RGB-D dual stream adapter, model/modal bidirectional knowledge distillation, prompt update와
  dual mask prediction으로 SAM을 COD에 맞춘다.
summary: SAM-DSA는 RGB-D dual stream adapter, model/modal bidirectional knowledge distillation, prompt update와 dual
  mask prediction으로 SAM을 COD에 맞춘다.
subtitle: SAM 본체를 크게 바꾸지 않고 RGB와 depth용 adapter를 attention block에 병렬 삽입하고, 양방향 distillation과 dual mask decoder로
  두 modality를 함께 학습한 SAM-DSA.
pubDate: 2026-04-01 09:00:00 +0900
slug: sam-dsa-rgbd-cod
kind: paper
lang: ko
tags:
- paper
- rgb-d-cod
- sam
- adapter
- iccv-2025
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2025/html/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.html
venue: ICCV 2025
paperYear: 2025
authors: Jiaming Liu, Linghe Kong, Guihai Chen
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2025/papers/Liu_Improving_SAM_for_Camouflaged_Object_Detection_via_Dual_Stream_Adapters_ICCV_2025_paper.pdf
takeaways:
- SAM encoder의 attention block에 RGB와 depth adapter를 병렬로 넣어 원 architecture와 pretrained 지식을 최대한 보존한다.
- 두 stream이 직접 섞이지 않아 생기는 channel discrepancy를 model·modal 양방향 knowledge distillation으로 줄인다.
- 정확한 depth 입력이 필요한 비용과, noisy monocular depth에서의 안정성을 RGB-only SAM adaptation과 함께 비교해야 한다.
---

## RGB에 안 보이는 구조를 depth에서 찾기

위장 객체는 RGB appearance를 배경에 맞추지만 실제 깊이 구조까지 완벽히 같지는 않을 수 있다. SAM-DSA는 RGB-D 입력으로 SAM을 COD에 적응시킨다. 전체 foundation model을 재설계하지 않고 **adapter만 encoder attention에 병렬 삽입**해 두 modality의 보완 정보를 학습한다.

parameter-efficient tuning의 장점을 유지하면서 depth stream을 별도 복제하는 방식이다. SAM의 일반 segmentation 지식은 보존하고, COD와 RGB-D fusion에 필요한 작은 경로만 훈련한다.

## dual stream adapters

각 attention block에서 RGB adapter와 depth adapter가 병렬로 image embedding을 보정한다. RGB는 texture·color·semantic을, depth는 surface separation과 geometry를 제공한다. 처음부터 두 입력을 채널 concat하면 한 modality의 noise가 전체 representation을 흔들 수 있지만, 분리 stream은 각 특징을 독립적으로 정제할 수 있다.

mask decoder도 RGB 경로와 depth-aware replica를 사용해 dual mask prediction을 수행한다. 두 결과는 같은 객체를 다른 관점에서 예측하므로 학습 중 상호 검증 신호가 된다.

## bidirectional knowledge distillation

stream을 완전히 분리하면 embedding channel과 semantic이 서로 다른 좌표계로 벌어진다. 논문은 **model distiller와 modal distiller**로 구성된 bidirectional knowledge distillation을 사용해 두 stream의 연관성을 높인다.

한쪽을 고정 teacher로 두는 단방향 distillation이 아니라 RGB와 depth가 서로 가르친다. RGB가 depth의 노이즈를 semantic으로 보정하고, depth가 RGB에서 모호한 경계를 geometry로 보완한다. 두 modality가 같은 정보를 복제하는 대신 공통 객체 표현에 수렴하도록 한다.

## prompt도 갱신한다

jointly learned RGB·depth embedding을 prompt embedding과 결합해 초기 prompt를 업데이트한 뒤 각 mask decoder로 보낸다. image feature만 fusion하고 prompt는 고정하는 방식보다, 현재 modality evidence에 맞게 “어디를 분할할지” 조건 자체를 조정한다.

image embedding과 prompt embedding의 consistency를 함께 맞추는 것이 SAM adaptation의 중요한 세부다. 좋은 depth feature가 있어도 prompt가 엉뚱한 위치를 가리키면 decoder가 활용하기 어렵다.

## 결과를 볼 때

네 COD benchmark에서 SAM baseline과 다른 fine-tuning 방식을 비교한다. 공정한 비교를 위해 depth가 ground truth sensor인지 monocular estimate인지, RGB-only baseline에도 같은 parameter budget을 주었는지 확인해야 한다. dual stream의 이득과 단순 입력 정보 증가의 효과를 분리해야 한다.

절제는 adapter 위치, distillation 방향, dual decoder, prompt update를 각각 다뤄야 한다. depth quality를 인위적으로 낮춘 robustness 실험도 실제 활용에 중요하다.

## 한계

모든 COD 데이터에 depth가 있는 것은 아니다. monocular depth를 쓰면 추가 foundation model 비용과 depth error가 생기고, 평면 그림이나 얇은 객체에서는 geometry cue가 약하다. 두 stream과 두 decoder는 adapter 방식이어도 추론 비용을 늘린다. missing depth 상황, sensor misalignment, 야간 noise에서 모델이 RGB-only보다 나빠지지 않는지 확인해야 한다.
