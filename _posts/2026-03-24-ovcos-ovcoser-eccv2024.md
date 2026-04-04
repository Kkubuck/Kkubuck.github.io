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

초록을 조금 더 풀어보면, 최근 CLIP과 같은 대규모 VLM(Vision-Language Model)의 등장으로 개방형 객체 인식을 향한 길이 열렸습니다. 많은 연구에서 추론 시 새로운 클래스로 다양한 개체를 인식해야 하는 까다로운 개방형 어휘 밀집 예측 작업을 위해 사전 훈련된 VLM의 활용을 탐구했습니다. 기존 방법은 관련 작업의 공개 데이터 세트를 기반으로 실험을 구성하는데, 이는 공개 어휘에 적합하지 않으며 데이터 수집 편향 및 주석 비용으로 인해 복잡한 장면에서 위장된 눈에 띄지 않는 객체를 거의 포함하지 않습니다. 격차를 메우기 위해 우리는 새로운 작업인 개방형 어휘 위장 객체 분할(OVCOS)을 도입하고 정밀한 주석과 해당 객체 클래스가 포함된 11,483개의 손으로 선택한 이미지를 포함하는 대규모 복합 장면 데이터 세트(OVCamo)를 구성합니다.

## 서론

이 논문의 포인트는 모델 하나보다 문제 정의를 다시 세운 데 있습니다. 위장 장면은 원래도 어렵지만, 여기에 novel class까지 들어오면 텍스트 의미와 시각 단서를 같이 맞춰야 해서 난도가 더 커집니다.

서론에서는 특히, 시각적 장면에서 물체 영역을 식별하고 추론하는 능력은 광범위한 인간 활동에 필수적입니다. Pang et al. 컴퓨터 비전, 복잡한 장면에서 다양한 모양의 객체를 감지하고 분할하는 것 또한 중요한 과제이며, 이는 자율 주행, 의료 영상 분석, 지능형 로봇 공학 등 비전 및 로봇 공학 분야 전반의 애플리케이션에 매우 중요합니다. 제안된 작업에 대한 알고리즘의 일반화를 더 잘 평가하고 분석하기 위해 기존 공개 데이터에서 신중하게 수집된 다양한 샘플을 포함하는 새로운 대규모 벤치마크 OVCamo가 제안되었습니다. – 강력한 기준선. 다중 소스 정보의 공동 최적화에 따라 우리의 접근 방식 OVCoser는 새로운 벤치마크에서 기존 OVSIS 알고리즘보다 성능이 뛰어납니다.

## 본론

OVCamo는 단순히 이미지 수를 늘린 데이터셋이 아니라, open-vocabulary setting에서 camouflage를 본격적으로 다루도록 설계된 benchmark입니다. 그래서 이후 open-vocabulary COD 연구의 기준점 역할을 합니다.

## 제안방법

OVCoser는 CLIP을 고정한 채 semantic guidance를 반복적으로 보정하고, edge와 depth에서 얻는 구조 단서를 더해 segmentation을 끌어올립니다. 핵심은 텍스트 의미만으로는 약한 장면에서 구조 힌트를 같이 쓰는 것입니다.

방법을 조금 더 자세히 보면, CamoPrompts 𝒫 매개변수 고정 매개변수 학습 가능 매개변수 없는 반복 개선 디코더 𝑪+ 𝑫+ 𝑬, 𝑇= 𝟐 시그모이드 프레임워크, OVCoser. 제안된 디코더에서는 의미론적으로 관련된 단서를 강조하기 위해 정규화된 텍스트 임베딩이 각 단계에 도입되었습니다. 따라서 낮은 수준의 SG에 부착된 SE 구성 요소는 가장자리 인식 및 깊이 인식 큐를 통합하고 구조적 세부 사항을 개선하기 위해 제안되었습니다. 한편, 객체 영역에 대한 디코더 출력의 강조로 인해 객체 인식 표현 fobj도 입력되며 이는 마지막 반복에서 거친 OVCOS 분할 예측에 의해 풀링된 이미지 특징에서 비롯됩니다.

## 실험

이 논문은 새 benchmark 제안 논문답게, 대표 실험도 OVCamo에서 기존 open-vocabulary segmentation baselines와의 격차를 보여주는 데 집중합니다.

실험 파트를 조금 더 자세히 보면, 5.2 시스템 수준 비교 제안된 OVCOS 작업의 복잡성을 보여주고 제안된 방법의 효율성을 검증하기 위해 [10,33,58-60,64]를 포함하여 OVSIS의 여러 최신 최신 방법과 OVCoser를 비교합니다. 2 그리고 우리의 접근 방식은 지속적으로 이러한 경쟁사보다 뛰어납니다. 우리의 방법은 Tab.에서 볼 수 있듯이 기존 방법에 비해 우수한 성능을 나타냅니다. 2.1 2.2 2.3 2.4 3.1 3.2 3.3 3.4 3.5 3.6 3.7 3.8 6.1 6.2 6.3 6.4 6.5 6.6 6.7 6.8 6.9 6.10 템플릿 0.62 0.64 0.66 0.68 0.70 0.72 정확도 0.70 0.75 0.80 0.85 0.90 0.95 1.00 1.05 1.10 훈련 및 테스트 클래스의 텍스트 임베딩 사이의 Hausdorff 거리 racy A 및 Hausdorff 거리 H는 OVCamo 데이터 세트의 일반 CLIP을 사용하여 분할됩니다.

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
