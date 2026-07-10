---
layout: post
title: Open-Vocabulary Camouflaged Object Segmentation
subtitle: “위장 객체가 어디 있는가”를 넘어 “무엇이 숨어 있는가”까지 다루기 위해 OVCamo 11,483장을 구축하고, frozen CLIP의 semantic과 edge·depth 구조 단서를 결합한 OVCoser.
summary: OVCOS라는 새 task와 OVCamo dataset을 제안한다. OVCoser는 고정된 CLIP에 iterative semantic guidance와 edge/depth structure enhancement를
  붙여 novel class를 분할한다.
description: OVCOS라는 새 task와 OVCamo dataset을 제안한다. OVCoser는 고정된 CLIP에 iterative semantic guidance와 edge/depth structure enhancement를
  붙여 novel class를 분할한다.
date: 2026-03-24 09:00:00 +0900
slug: ovcos-ovcoser-eccv2024
lang: ko
paper: true
categories:
- papers
tags:
- paper
- open-vocabulary
- cod
- vision-language
- eccv-2024
venue: ECCV 2024
paper_year: 2024
paper_authors: Youwei Pang, Xiaoqi Zhao, Jiaming Zuo, Lihe Zhang, Huchuan Lu
reviewed_on: '2026-07-10'
source_url: https://eccv.ecva.net/virtual/2024/poster/786
pdf_url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/00786.pdf
code_url: https://github.com/lartpang/OVCamo
takeaways:
- binary COD를 class-aware open-vocabulary segmentation으로 확장하고 이를 위한 OVCamo dataset을 만든다.
- frozen CLIP의 class semantic을 반복적으로 주입하면서 edge와 depth가 약한 위치·형태 정보를 보완한다.
- open-vocabulary 평가는 class split, prompt wording, CLIP pretraining leakage에 매우 민감하다.
---

## 숨은 물체의 이름까지 묻기

기존 COD는 객체 종류와 상관없이 모든 위장 영역을 하나의 foreground로 분할한다. 실제 응용에서는 “무언가 있다”뿐 아니라 동물인지 장비인지, 어떤 class인지 알아야 할 수 있다. **Open-Vocabulary Camouflaged Object Segmentation(OVCOS)**은 학습 때 보지 못한 class까지 텍스트 지식으로 인식하며 마스크를 예측하는 문제다.

일반 open-vocabulary segmentation dataset에는 눈에 잘 띄는 객체가 많다. 위장 객체는 수집과 정밀 주석이 어렵기 때문에 기존 benchmark만으로는 이 능력을 평가하기 힘들다.

## OVCamo dataset

저자들은 11,483개의 hand-selected image에 fine mask와 object class를 붙인 OVCamo를 구축한다. 규모뿐 아니라 class-aware annotation이 중요하다. binary mask만 있으면 CLIP의 언어 표현이 어떤 객체를 가리키는지 학습·평가할 수 없기 때문이다.

데이터셋은 seen class와 unseen class를 나눠 open-vocabulary generalization을 측정한다. 여기서 split 설계가 핵심이다. 시각적으로 매우 비슷한 하위 종이 양쪽에 섞이면 사실상 fine-grained transfer가 되고, CLIP pretraining에서 class image를 이미 본 경우 엄밀한 ‘unseen’ 의미도 복잡해진다.

## OVCoser의 세 단서

OVCoser는 parameter-fixed CLIP을 기반으로 한다. 대형 vision-language model의 semantic 공간을 보존하면서 COD에 맞는 모듈만 학습해, base class에 과적합되어 open-vocabulary 능력을 잃는 것을 줄인다.

첫째, class text와 image feature 사이의 **iterative semantic guidance**가 객체 후보를 반복적으로 좁힌다. 둘째, edge cue가 위장 객체의 모호한 윤곽을 복구한다. 셋째, depth cue가 RGB appearance가 비슷한 객체와 배경을 3D 구조에서 분리한다. 언어는 ‘무엇’, 구조 단서는 ‘어디와 어떤 모양’을 보완한다.

## single-stage라는 선택

open-vocabulary dense prediction은 먼저 class-agnostic proposal을 만들고 나중에 CLIP으로 분류하는 two-stage 방식이 흔하다. OVCoser는 semantic과 structure를 한 네트워크에서 함께 갱신하는 single-stage baseline을 지향한다. proposal 누락이 후단에서 복구되지 않는 문제를 줄이고, class 정보가 초기 localization에도 영향을 줄 수 있다.

반대로 semantic bias가 강하면 텍스트와 닮은 배경을 객체로 만들 수 있다. frozen CLIP의 일반 지식과 COD-specific visual cue 사이 균형이 중요하다.

## 평가에서 확인할 것

seen/unseen class 성능을 따로 보고 harmonic mean처럼 균형을 확인해야 한다. seen 성능만 높으면 일반적인 supervised segmentation이고, unseen만 강조하다 base class가 무너지면 실용성이 낮다. class-agnostic COD metric과 class-aware IoU를 함께 보면 위치 실패와 분류 실패를 구분할 수 있다.

edge·depth를 제거한 절제, prompt template 변화, 다른 CLIP backbone에서의 안정성도 핵심이다. 특히 depth가 실제 센서인지 monocular estimate인지에 따라 비용과 오류 특성이 크게 달라진다.

## 한계와 의미

OVCamo는 연구 기반을 넓히지만 수집 출처와 class 빈도의 long tail, 텍스트 label의 모호성이 남는다. CLIP이 학습 중 유사 이미지를 봤는지 완전히 알기 어렵고, “개구리”와 “동물”처럼 계층이 다른 prompt에서 평가가 달라진다. 그럼에도 COD를 binary benchmark에서 open-world scene understanding으로 확장한 중요한 전환점이다.
