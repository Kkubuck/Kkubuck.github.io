---
layout: post
title: Multi-modal Segment Anything Model for Camouflaged Scene Segmentation
subtitle: 수동 prompt 대신 BLIP이 만든 caption의 text embedding과 image embedding을 SAM에 주입해, 장면 의미를 먼저 이해한 뒤 위장 객체 마스크를 생성하는 Vision-Language-SAM.
summary: BLIP text·visual embedding, multi-level adapter, SAM dense embedding 교체를 통해 prompt-free multimodal COD를 구현하고 다른 segmentation
  task로도 확장한다.
description: BLIP text·visual embedding, multi-level adapter, SAM dense embedding 교체를 통해 prompt-free multimodal COD를 구현하고
  다른 segmentation task로도 확장한다.
date: 2026-03-29 09:00:00 +0900
slug: mm-sam-camouflaged-scene-segmentation
lang: ko
paper: true
categories:
- papers
tags:
- paper
- sam
- vision-language
- multimodal
- iccv-2025
venue: ICCV 2025
paper_year: 2025
paper_authors: Guangyu Ren, Hengyan Liu, Michalis Lazarou, Tania Stathaki
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.html
pdf_url: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.pdf
code_url: https://github.com/ic-qialanqian/Vision-Language-SAM
takeaways:
- 사람의 point·box 대신 BLIP caption과 visual embedding을 자동 multimodal prompt로 사용한다.
- multi-level adapter가 언어·시각 semantic을 SAM 여러 계층에 넣고, 기존 dense prompt embedding도 image embedding으로 교체한다.
- caption이 객체를 언급하지 않거나 잘못 묘사하면 semantic prompt가 localization을 오히려 방해할 수 있다.
---

## prompt-free SAM을 만드는 방법

SAM은 무엇을 자를지 알려 주는 prompt가 필요하다. 위장 장면에서는 사용자가 객체를 못 찾을 수 있으므로, prompt 생성 자체가 COD의 핵심 문제가 된다. 이 논문은 별도 detector 대신 **vision-language model BLIP의 장면 이해**를 prompt로 사용한다.

이미지를 설명하는 caption은 “나뭇잎 사이의 개구리”처럼 픽셀 대비가 약해도 semantic object를 언급할 수 있다. visual embedding은 caption이 놓친 공간·외형 정보를 보완한다. 두 modality를 SAM에 함께 전달해 수동 입력 없이 mask를 만든다.

## text prompt와 visual prompt

먼저 BLIP이 image caption을 생성하고 text encoder가 문장 embedding을 만든다. 동시에 BLIP vision encoder에서 image embedding을 얻는다. text는 어떤 객체가 있을 법한지, visual은 장면의 실제 패턴과 위치가 어떤지에 대한 서로 다른 정보를 담는다.

단순히 두 vector를 SAM prompt encoder에 붙이는 것으로는 계층과 차원이 맞지 않는다. **multi-level adapter**가 SAM의 여러 representation level에서 multimodal feature를 정렬하고 주입한다. 고수준 semantic이 낮은 수준 spatial detail을 완전히 덮지 않도록 단계적으로 결합한다.

## dense embedding을 바꾸다

SAM은 일반적으로 point·box와 함께 dense mask prompt embedding을 사용할 수 있다. 이 방법은 사람이 만든 dense prompt가 없으므로, 그 자리를 SAM image encoder의 image embedding으로 대체한다. 입력 이미지 자체에서 얻은 촘촘한 표현을 mask decoder의 조건으로 직접 활용한다.

결과적으로 text가 class와 context를 좁히고, BLIP visual과 SAM image feature가 공간 구조를 채운다. 수동 prompt 하나를 다른 자동 detector로 치환한 것이 아니라, 두 foundation model의 표현을 재조합한 구조다.

## 실험이 말하는 범위

논문은 세 COD benchmark의 12개 metric 중 11개에서 강한 결과를 보고하고, 의료 영상 분할에도 적응 가능성을 보인다. 여러 과업에서 작동한다는 점은 adapter가 특정 동물 texture만 외운 것이 아니라는 근거가 될 수 있다.

다만 비교 시 BLIP와 SAM 두 대형 모델의 parameter·pretraining data·추론 비용을 포함해야 한다. 작은 specialist COD model과 최종 accuracy만 비교하면 자원 차이가 가려진다. caption 품질별 성능과 text 제거, visual 제거, dense replacement 제거 절제가 핵심이다.

## 좋은 점

이 연구는 자동 prompt를 좌표가 아니라 **semantic representation**으로 본다. 위장 객체의 위치를 처음부터 정확히 모를 때도 장면 설명이 search space를 줄일 수 있다. 또한 adapter 중심 fine-tuning은 foundation model 전체를 바꾸지 않아 일반 지식을 보존한다.

비슷한 전략은 의료 소견 문장, 원격탐사 메타데이터, 로봇 instruction처럼 텍스트 context가 있는 segmentation에 확장할 수 있다.

## 취약점

caption model은 눈에 잘 띄는 객체를 우선 설명하므로 진짜 위장 객체를 생략할 수 있다. 존재하지 않는 객체를 hallucination하거나 class를 틀리게 부르면 SAM이 잘못된 영역을 찾을 위험도 있다. 언어가 없는 장면, 다중 객체, 긴 class tail에서 robustness를 확인해야 한다. 자동 caption의 uncertainty를 mask decoder가 인식하도록 하는 장치가 다음 단계다.
