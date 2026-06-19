---
layout: "post"
title: "COD 벤치마크 정리"
subtitle: "정적 RGB COD부터 비디오, open-vocabulary, unconstrained setting까지 지금 자주 보는 평가축을 한 번에 묶어본다."
summary: "정적 RGB COD부터 비디오, open-vocabulary, unconstrained setting까지 지금 자주 보는 평가축을 한 번에 묶어본다."
description: "정적 RGB COD부터 비디오, open-vocabulary, unconstrained setting까지 지금 자주 보는 평가축을 한 번에 묶어본다."
date: "2026-03-25 09:00:00 +0900"
slug: "cod-benchmarks-guide"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "benchmark"
  - "survey"
venue: "Benchmark Guide"
source_url: "https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2021/papers/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.pdf"
---

## 오버뷰

COD 논문을 읽다 보면 표는 많아지는데, 어떤 벤치마크가 무엇을 검증하는지는 오히려 흐려질 때가 많습니다. 이번 글은 최근 위장 객체 연구를 읽을 때 자주 만나는 대표 데이터셋과 평가축을 빠르게 다시 잡기 위한 정리입니다.

## 핵심 주장

- 정적 RGB COD만 보면 최근 연구의 방향을 절반만 보는 셈이고, 이제는 비디오, open-vocabulary, unconstrained scene, multispectral setting까지 함께 봐야 한다.
- 같은 수치라도 어떤 벤치마크에서 얻은 결과인지에 따라 의미가 달라진다.
- 논문을 읽을 때는 절대 점수보다도 데이터셋의 성격, supervision 조건, task setting을 같이 확인해야 한다.

## 초록

이 글은 한 편의 논문 리뷰라기보다, 최근 COD 관련 논문을 읽을 때 기준점이 되는 벤치마크를 묶어서 보는 메모에 가깝습니다. 특히 2024~2025년 논문들은 기존 RGB 정적 분할만 다루지 않고, 비디오 VCOD, open-vocabulary OVCOS, salient/camouflaged coexistence, multispectral benchmark까지 확장하고 있습니다.

## 서론

초기 COD 비교는 CHAMELEON, CAMO, COD10K, NC4K 같은 정적 RGB 이미지 중심이었습니다. 하지만 최근 논문은 같은 위장 객체 문제라도 입력 조건과 평가 목표가 꽤 다르기 때문에, 어느 벤치마크에서 성능이 올랐는지 먼저 이해해야 방법의 진짜 의미가 보입니다.

## 본론

예를 들어 CHAMELEON이나 CAMO에서 좋은 모델이 반드시 비디오 VCOD나 open-vocabulary setting에서도 강하다고 볼 수는 없습니다. 반대로 OVCamo에서 의미 정렬을 잘하는 모델이 전통적인 RGB COD에서 항상 가장 좋은 경계 품질을 내는 것도 아닙니다. 결국 벤치마크는 성능표를 읽기 위한 맥락입니다.

## 제안방법

이번 정리는 벤치마크를 네 갈래로 나눠 봅니다. 첫째, 정적 RGB COD. 둘째, 비디오 COD. 셋째, open-vocabulary 및 scene-level 확장. 넷째, 멀티모달·멀티스펙트럴 확장입니다. 각 벤치마크가 검증하는 능력이 다르기 때문에, 이후 논문 리뷰도 이 분류를 기준으로 같이 읽는 편이 좋습니다.

## 실험

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| CHAMELEON | 초기 정적 RGB COD 비교에 자주 쓰이는 소규모 테스트셋이다. 빠르게 qualitative gap을 확인할 때 자주 등장한다. |
| CAMO | 위장 정도가 강하고 경계가 까다로운 정적 RGB 설정을 점검할 때 중요하다. 최근까지도 주요 표에 빠지지 않는다. |
| COD10K | 가장 널리 쓰이는 정적 RGB COD 범용 benchmark다. 최근 방법들의 기본 비교축으로 보면 된다. |
| NC4K | 복잡한 자연 장면에서의 일반화 성능을 확인할 때 자주 쓰인다. COD10K와 함께 묶여 나오는 경우가 많다. |
| MoCA-Mask | 비디오 camouflaged object detection의 대표 benchmark다. 움직임과 temporal consistency를 함께 본다. |
| OVCamo | ECCV 2024 OVCOS 논문이 제안한 open-vocabulary camouflaged object segmentation benchmark다. 텍스트-비전 정렬과 novel class generalization을 본다. |
| USC12K | ICCV 2025 USCNet이 제안한 unconstrained scene benchmark다. salient object와 camouflaged object가 함께 존재하는 장면까지 평가한다. |
| MCOD | 멀티스펙트럴 COD benchmark로, RGB 한계 밖의 단서를 활용하는 설정을 본다. |

표를 읽을 때는 데이터셋 이름만 보기보다, 이 벤치마크가 정적/비디오인지, close-set/open-vocabulary인지, fully supervised인지 약한 supervision인지까지 같이 확인하는 편이 좋습니다.

## 결론

최근 COD 논문 흐름은 단순히 분할 성능을 올리는 경쟁에서 벗어나, 어떤 조건의 위장 장면을 다루는가로 빠르게 확장되고 있습니다. 그래서 이제는 단일 리더보드보다 벤치마크 맥락을 먼저 이해하는 것이 더 중요해졌습니다.

## 논의

개인적으로는 앞으로 COD 논문을 읽을 때 `COD10K/CAMO에서 강한가`, `비디오에서도 버티는가`, `텍스트 조건이나 scene-level ambiguity까지 다루는가`를 나눠 보는 습관이 중요해 보입니다. 같은 SOTA라도 무엇을 더 어렵게 만들었는지에 따라 의미가 꽤 다르기 때문입니다.

## 출처
- CAMO/랭킹 기반 COD: https://openaccess.thecvf.com/content/CVPR2021/html/Lv_Simultaneously_Localize_Segment_and_Rank_the_Camouflaged_Objects_CVPR_2021_paper.html
- OVCamo/OVCOS: https://eccv.ecva.net/virtual/2024/poster/786
- MoCA-Mask/VCOD benchmark: https://openaccess.thecvf.com/content/CVPR2022/html/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.html
- USC12K: https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.html
