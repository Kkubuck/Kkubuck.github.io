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

## 서론

SAM은 범용 분할 모델이지만, 위장 장면처럼 객체와 배경의 차이가 작을 때는 추가 semantic cue가 필요하다. 이 논문은 그 cue를 외부 foundation model에서 가져오되, 수동 프롬프트 대신 자동 멀티모달 prompt로 제공한다.

## 본론

MM-SAM의 관점은 위장 장면 분할을 prompt engineering 문제로 다시 보는 것이다. 무엇을 클릭할지 사람이 지정하는 대신, caption과 visual embedding이 객체를 설명하는 단서를 대신 제공하게 한다.

## 제안방법

먼저 BLIP로 이미지 캡션을 만들고, text encoder로 텍스트 임베딩을 얻는다. 동시에 BLIP vision encoder에서 visual embedding을 만든 뒤, 두 신호를 SAM 입력으로 넣는다. 또 multi-level adapter로 멀티모달 정보를 SAM 내부에 통합하고, 기존 dense embedding 대신 image encoder의 image embedding을 활용해 표현력을 높인다.

## 실험

아래 표는 strong SAM baseline인 SAM-Adapter와 MM-SAM을 Sα, Fwβ 기준으로 비교한 것이다.

| 데이터셋 | SAM-Adapter Sα↑ | MM-SAM Sα↑ | SAM-Adapter Fwβ↑ | MM-SAM Fwβ↑ |
| --- | ---: | ---: | ---: | ---: |
| CHAMELEON | 0.896 | **0.923** | 0.824 | **0.853** |
| CAMO | 0.847 | **0.863** | 0.765 | **0.782** |
| COD10K | 0.883 | **0.896** | 0.801 | **0.808** |

특히 CHAMELEON에서 개선 폭이 크고, CAMO와 COD10K에서도 일관된 상승이 확인된다. 멀티모달 prompt가 위장 장면에서 실제로 도움이 된다는 메시지가 표와 잘 맞는다.

## 결론

MM-SAM은 SAM을 위장 장면에 맞게 쓰기 위한 멀티모달 prompt 설계의 좋은 사례다. foundation model 조합이지만, 목적이 분명하고 성능 개선도 비교적 일관적이다.

## 논의

SAM 관련 논문이 많지만, MM-SAM은 '무엇을 prompt로 줄 것인가'를 비교적 설득력 있게 답한다. 수동 프롬프트를 자동 멀티모달 prompt로 치환하는 방식이 앞으로 다른 COD/segmentation 문제에도 꽤 자주 재사용될 것 같다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2025/html/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2025/papers/Ren_Multi-modal_Segment_Anything_Model_for_Camouflaged_Scene_Segmentation_ICCV_2025_paper.pdf
