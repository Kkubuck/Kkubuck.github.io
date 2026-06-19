---
layout: "post"
title: "Multi-modal Segment Anything Model for Camouflaged Scene Segmentation"
subtitle: "MM-SAM은 BLIP에서 만든 텍스트·비전 임베딩을 SAM prompt로 넣어 수동 프롬프트 없이 위장 장면 분할을 개선한다."
summary: "MM-SAM은 BLIP에서 만든 텍스트·비전 임베딩을 SAM prompt로 넣어 수동 프롬프트 없이 위장 장면 분할을 개선한다."
description: "MM-SAM은 BLIP에서 만든 텍스트·비전 임베딩을 SAM prompt로 넣어 수동 프롬프트 없이 위장 장면 분할을 개선한다."
date: "2026-03-29 09:00:00 +0900"
slug: "mm-sam-camouflaged-scene-segmentation"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sam"
  - "multimodal"
  - "iccv2025"
venue: "ICCV 2025"
source_url: "https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.pdf"
---
## 오버뷰

MM-SAM은 SAM을 직접 사람 손으로 프롬프트하는 대신, BLIP 기반 텍스트/비전 임베딩을 자동으로 만들어 prompt로 넣는다. 즉, 수동 prompt 없이도 위장 장면에서 SAM을 더 쓸 만하게 만드는 방향이다.

## 핵심 주장

- 위장 장면에서는 SAM에 추가 semantic information을 주지 않으면 분할 품질이 쉽게 흔들린다.
- MM-SAM은 BLIP로 만든 텍스트/비전 임베딩과 multi-level adapter를 통해 SAM 내부에 멀티모달 신호를 주입한다.
- SAM-Adapter와 비교해 세 데이터셋에서 Sα와 Fwβ를 모두 높이며, 초록 기준 12개 지표 중 11개에서 새로운 최고 성능을 기록했다.

## 초록

논문은 BLIP를 사용해 이미지 캡션과 시각 임베딩을 만들고, 이를 SAM에 멀티모달 prompt로 넣어 위장 장면 분할을 개선한다. 여기에 multi-level adapter와 image embedding replacement를 더해 SAM 내부 통합 방식을 바꾼다. 결과적으로 세 benchmark에서 12개 지표 중 11개를 개선했다고 보고한다.

초록을 조금 더 풀어보면, 물체가 주변 환경과 완벽하게 조화를 이루는 위장된 장면은 인간 관찰자와 컴퓨터 비전 시스템 모두에게 심각한 문제를 야기합니다. 이 문제를 해결하기 위해 우리는 기성 기반 모델을 활용하여 SAM(Segment Anything Model)에 대한 다중 모드 프롬프트를 생성하는 새로운 프레임워크를 제안합니다. 이를 통해 수동 프롬프트가 필요하지 않고 이 다운스트림 작업의 전반적인 성능이 크게 향상됩니다. 먼저 BLIP 모델을 사용하여 이미지 캡션을 생성하고 텍스트 인코더를 사용하여 텍스트 임베딩을 얻습니다. 그런 다음 BLIP 모델의 비전 인코더를 통해 시각적 임베딩을 생성하고 두 가지를 모두 SAM에 대한 입력으로 사용하여 이미지에 대한 추가 의미 정보를 제공합니다.

## 서론

SAM은 범용 분할 모델이지만, 위장 장면처럼 객체와 배경의 차이가 작을 때는 추가 semantic cue가 필요하다. 이 논문은 그 cue를 외부 foundation model에서 가져오되, 수동 프롬프트 대신 자동 멀티모달 prompt로 제공한다.

서론에서는 특히, 위장 개체 감지(COD)는 주변 환경과 시각적으로 혼합되어 유사한 색상과 패턴을 공유하는 경우가 많아 감지하기 어려운 개체를 식별하는 데 중점을 둡니다. COD는 감시 시스템, 야생 동물 모니터링, 추적 및 저고도 경제(LAE)와 같은 분야에서 잠재적인 영향과 광범위한 응용으로 인해 컴퓨터 비전 분야에서 상당한 주목을 받아 왔습니다. 이 연구에서 우리는 COD에서 SAM의 과제를 해결하고 SAM을 활용하여 COD 이미지를 성공적으로 분할하는 새로운 방법을 제안합니다. 우리는 이 방법을 MM-SAM(Multi-modal Segment Anything)이라고 부릅니다.

## 본론

MM-SAM의 관점은 위장 장면 분할을 prompt engineering 문제로 다시 보는 것이다. 무엇을 클릭할지 사람이 지정하는 대신, caption과 visual embedding이 객체를 설명하는 단서를 대신 제공하게 한다.

## 제안방법

먼저 BLIP로 이미지 캡션을 만들고, text encoder로 텍스트 임베딩을 얻는다. 동시에 BLIP vision encoder에서 visual embedding을 만든 뒤, 두 신호를 SAM 입력으로 넣는다. 또 multi-level adapter로 멀티모달 정보를 SAM 내부에 통합하고, 기존 dense embedding 대신 image encoder의 image embedding을 활용해 표현력을 높인다.

방법을 조금 더 자세히 보면, 핵심은 BLIP에서 얻은 텍스트와 비전 단서를 단순히 SAM 앞단에 붙이는 것이 아니라, multi-level adapter를 통해 SAM 내부 표현과 단계적으로 섞는 데 있습니다. 이렇게 하면 전체 장면을 설명하는 caption 정보와 지역 시각 특징이 함께 반영되어, 위장 객체처럼 경계가 모호한 대상도 더 안정적으로 드러납니다. 저자들은 특히 dense embedding을 재구성하는 과정에서 멀티모달 정보를 프롬프트처럼 활용해, 기존 SAM보다 작업 특화된 representation을 만들 수 있다고 설명합니다.

## 실험

아래 표는 strong SAM baseline인 SAM-Adapter와 MM-SAM을 Sα, Fwβ 기준으로 비교한 것이다.

실험 파트를 조금 더 자세히 보면, 데이터 세트 및 평가 지표 위장된 개체 감지 작업을 위해 경계 상자, 낙서, 점 또는 전체 마스크와 같은 추가 프롬프트를 제공하지 않고 실험에서 COD10K 데이터 세트, CHAMELEON 데이터 세트 및 CAMO 데이터 세트를 활용합니다. 각 방법의 효율성에 대한 포괄적인 평가를 제공하기 위해 이 비교는 CHAMELEON, CAMO 및 COD10K의 세 가지 벤치마크 데이터 세트에 대한 비교입니다. 훈련이 필요 없는 의료 영상 분할 우리의 모델을 의료 영상 분할에 대한 다른 최첨단(SOTA) 훈련이 필요 없는 방법과 비교합니다. AlignSAM과 동일한 평가 지표를 사용하여 추가 미세 조정 없이 DUTS 및 CUHK 데이터 세트에 방법을 직접 적용합니다.

## 결론

MM-SAM은 SAM을 위장 장면에 맞게 쓰기 위한 멀티모달 prompt 설계의 좋은 사례다. foundation model 조합이지만, 목적이 분명하고 성능 개선도 비교적 일관적이다.

## 논의

SAM 관련 논문이 많지만, MM-SAM은 '무엇을 prompt로 줄 것인가'를 비교적 설득력 있게 답한다. 수동 프롬프트를 자동 멀티모달 prompt로 치환하는 방식이 앞으로 다른 COD/segmentation 문제에도 꽤 자주 재사용될 것 같다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.pdf
