---
layout: "post"
title: "Open-Vocabulary Camouflaged Object Segmentation"
subtitle: "이 논문은 기존 open-vocabulary segmentation 데이터셋이 위장 장면을 거의 다루지 못한다는 점에서 출발합니다. 그래서 OVCOS라는 새 문제를 정의하고, OVCamo라는 전용 benchmark와 CLIP 기반 baseline인 OVCoser를 함께 제안합니다."
summary: "이 논문은 기존 open-vocabulary segmentation 데이터셋이 위장 장면을 거의 다루지 못한다는 점에서 출발합니다. 그래서 OVCOS라는 새 문제를 정의하고, OVCamo라는 전용 benchmark와 CLIP 기반 baseline인 OVCoser를 함께 제안합니다."
description: "이 논문은 기존 open-vocabulary segmentation 데이터셋이 위장 장면을 거의 다루지 못한다는 점에서 출발합니다. 그래서 OVCOS라는 새 문제를 정의하고, OVCamo라는 전용 benchmark와 CLIP 기반 baseline인 OVCoser를 함께 제안합니다."
date: "2026-03-24 09:00:00 +0900"
slug: "ovcos-ovcoser-eccv2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "ovcos"
  - "eccv2024"
venue: "ECCV 2024"
source_url: "https://eccv.ecva.net/virtual/2024/poster/786"
pdf_url: "https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/06409.pdf"
---

## 오버뷰

이 논문은 기존 open-vocabulary segmentation 데이터셋이 위장 장면을 거의 다루지 못한다는 점에서 출발합니다. 그래서 OVCOS라는 새 문제를 정의하고, OVCamo라는 전용 benchmark와 CLIP 기반 baseline인 OVCoser를 함께 제안합니다.

## 핵심 주장

- open-vocabulary COD는 기존 OVSIS benchmark로는 충분히 평가되지 않는다.
- OVCamo는 11,483장 규모로 위장 장면과 클래스 정보를 함께 담은 전용 benchmark다.
- OVCoser는 iterative semantic guidance와 edge/depth 구조 단서를 결합해 OVCamo에서 이전 open-vocabulary segmentation baselines를 크게 앞선다.

## 초록

저자들은 CLIP 같은 VLM이 open-world perception을 넓혔지만, 기존 open-vocabulary dense prediction 데이터는 복잡한 위장 장면과 세밀한 객체 인식을 거의 포함하지 못한다고 지적합니다. 이를 보완하기 위해 OVCOS라는 새 과제를 정의하고, OVCamo 데이터셋과 OVCoser baseline을 제안합니다.

## 서론

이 논문의 포인트는 모델 하나보다 문제 정의를 다시 세운 데 있습니다. 위장 장면은 원래도 어렵지만, 여기에 novel class까지 들어오면 텍스트 의미와 시각 단서를 같이 맞춰야 해서 난도가 더 커집니다.

## 본론

OVCamo는 단순히 이미지 수를 늘린 데이터셋이 아니라, open-vocabulary setting에서 camouflage를 본격적으로 다루도록 설계된 benchmark입니다. 그래서 이후 open-vocabulary COD 연구의 기준점 역할을 합니다.

## 제안방법

OVCoser는 CLIP을 고정한 채 semantic guidance를 반복적으로 보정하고, edge와 depth에서 얻는 구조 단서를 더해 segmentation을 끌어올립니다. 핵심은 텍스트 의미만으로는 약한 장면에서 구조 힌트를 같이 쓰는 것입니다.

## 실험

이 논문은 새 benchmark 제안 논문답게, 대표 실험도 OVCamo에서 기존 open-vocabulary segmentation baselines와의 격차를 보여주는 데 집중합니다.

### 메인 실험 결과

| 모델 | 텍스트 백본 | 비전 백본 | 프롬프트 | OVCamo (cSm↑ cFωβ↑ cMAE↓ cFβ↑ cEm↑ cIoU↑) |
| --- | --- | --- | --- | --- |
| SimSeg21 [60] | CLIP-ViT-B/16 [47] | ResNet-101 [20] | Learnable [82] | 0.053 0.049 0.921 0.056 0.098 0.047 |
| OVSeg22 [33] | CLIP-ViT-L/14 [47] | Swin-B [36] | [18] | 0.024 0.046 0.954 0.056 0.130 0.046 |
| ODISE23 [58] | CLIP-ViT-L/14 [47] | StableDiffusionv1.3 [50] | [17] | 0.187 0.119 0.700 0.211 0.298 0.167 |
| SAN23 [59] | CLIP-ViT-L/14 [47] | ViT Adapter | [18] | 0.275 0.202 0.612 0.220 0.318 0.189 |
| CAT-Seg23 [10] | CLIP-ViT-L/14 [47] | Swin-B [36] | [47] | 0.181 0.106 0.719 0.123 0.196 0.094 |
| FC-CLIP23 [64] | CLIP-ConvNeXt-L [9] | — | [18] | 0.080 0.076 0.872 0.090 0.191 0.072 |
| Ours | CLIP-ConvNeXt-L [9] | — | CamoPrompts | 0.579 0.490 0.336 0.520 0.616 0.443 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

OVCOS는 COD를 텍스트 조건과 일반화 문제까지 확장한 기준 작업입니다. 이후 open-vocabulary camouflage 연구를 볼 때 거의 출발점처럼 읽히는 논문입니다.

## 논의

지금 봐도 의미가 큰 이유는, 단순히 성능을 올렸다기보다 어떤 benchmark가 있어야 이 문제를 제대로 측정할 수 있는지를 정리해 줬기 때문입니다.

## 출처
- 논문 페이지: https://eccv.ecva.net/virtual/2024/poster/786
- 원문 PDF: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/06409.pdf
