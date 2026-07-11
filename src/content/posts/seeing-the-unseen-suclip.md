---
title: 'Seeing the Unseen: A Semantic Alignment and Context-Aware Prompt Framework for Open-Vocabulary Camouflaged
  Object Segmentation'
description: SuCLIP은 context-aware prompt, class-aware feature selection, semantic consistency loss, text query
  decoder로 OVCOS의 semantic confusion을 직접 다룬다.
summary: SuCLIP은 context-aware prompt, class-aware feature selection, semantic consistency loss, text query decoder로
  OVCOS의 semantic confusion을 직접 다룬다.
subtitle: CLIP text가 위장 장면의 local visual과 어긋나 생기는 class shift를 줄이기 위해, visual context로 prompt를 보강하고 class-aware
  feature selection과 semantic-consistent decoding을 결합한 SuCLIP.
pubDate: 2026-04-04 09:00:00 +0900
slug: seeing-the-unseen-suclip
kind: paper
lang: ko
tags:
- paper
- open-vocabulary
- cod
- clip
- iccv-2025
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.html
venue: ICCV 2025
paperYear: 2025
authors: Peng Ren, Tian Bai, Jing Sun, Fuming Sun
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Seeing_the_Unseen_A_Semantic_Alignment_and_Context-Aware_Prompt_Framework_ICCV_2025_paper.pdf
takeaways:
- OVCOS의 실패를 localization만이 아니라 text–visual semantic confusion과 class shift 문제로 진단한다.
- CLIP visual encoder의 내부 context로 text prompt를 보강하고 class-aware selection이 local feature와의 정렬을 조절한다.
- prompt template와 CLIP pretraining class exposure가 unseen 성능에 미치는 영향을 분리해 봐야 한다.
---

## OVCOS의 두 번째 병목

OVCoser가 open-vocabulary COD의 task와 dataset을 열었다면, SuCLIP은 그다음 실패를 더 구체적으로 본다. 위장 객체는 시각 특징이 배경에 섞여 있어 text embedding과 local pixel feature의 semantic alignment가 흔들린다. 그 결과 객체 일부만 분할되거나 다른 class로 이동하는 **semantic confusion과 class shift**가 생긴다.

단순히 더 강한 mask decoder를 쓰는 것으로는 해결하기 어렵다. 텍스트가 현재 이미지 맥락에 맞게 바뀌고, visual feature도 해당 class와 관련된 부분을 선택해야 한다.

## context-aware prompt

고정 prompt인 “a photo of a [class]”는 일반 장면에는 유용하지만 숲, 모래, 수중처럼 객체 appearance가 크게 변하는 위장 상황을 충분히 설명하지 못한다. SuCLIP은 CLIP visual encoder 내부의 knowledge를 이용해 text prompt를 현재 image context로 보강한다.

텍스트가 visual을 일방적으로 검색하는 대신, 이미지가 어떤 표현이 필요한지 prompt에 되돌려 준다. 예를 들어 같은 ‘frog’라도 잎 사이, 진흙, 수중 맥락에서 관련 visual attribute가 달라질 수 있다.

## class-aware feature selection

모든 visual token을 text와 동일하게 맞추면 background가 많은 위장 이미지에서 semantic이 오염된다. **class-aware feature selection**은 현재 class와 관련성이 높은 local feature를 동적으로 고르고, text와 visual embedding을 함께 조정한다.

이는 hard cropping이 아니라 representation space의 정렬이다. 객체 후보 token은 class semantic에 가까워지고, 반복되는 background texture는 상대적으로 약해진다. unseen class에서도 CLIP의 pretrained relation을 유지하면서 COD-specific noise를 줄이는 것이 목표다.

## semantic consistency와 text query decoder

**semantic consistency loss**는 최종 segmentation result의 visual semantic이 입력 text prompt에서 벗어나지 않도록 한다. 마스크가 공간적으로 그럴듯해도 다른 동물이나 배경을 포함하면 penalty를 받는다.

마지막 text query decoder는 text semantic을 pixel-level mask로 직접 투영한다. class score를 후처리로 붙이는 대신 decoding 과정에서 semantic과 spatial consistency를 함께 최적화한다. OVCOS에서 localization과 recognition을 분리하지 않는 설계다.

## OVCoser 대비 무엇이 달라졌나

OVCoser는 frozen CLIP에 iterative semantic guidance와 edge·depth structure cue를 결합해 task baseline을 세웠다. SuCLIP은 구조 단서 추가보다 **언어–시각 정렬 자체의 오류**에 집중한다. OVCamo에서 OVCoser를 넘어선 결과는 이 진단이 유효하다는 근거를 제공한다.

실험에서는 seen/unseen 성능, harmonic balance, class-wise confusion matrix를 함께 봐야 한다. context prompt, feature selection, consistency loss, text decoder를 제거했을 때 incomplete mask와 class shift가 각각 어떻게 변하는지도 중요하다.

## 한계

CLIP의 internal knowledge가 항상 올바른 context를 제공하지 않는다. background가 특정 class와 강하게 연관되면 prompt가 shortcut을 강화할 수 있다. unseen이라는 정의도 CLIP pretraining data를 완전히 알 수 없어 엄밀하지 않다. synonym, 상위·하위 class, 긴 description에 대한 prompt sensitivity와 새로운 dataset에서의 zero-shot transfer가 후속 검증 포인트다.
