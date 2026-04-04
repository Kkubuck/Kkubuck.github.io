---
layout: "post"
title: "Source-free Depth for Object Pop-out"
subtitle: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
summary: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
description: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
date: "2026-03-17 09:00:00 +0900"
slug: "source-free-depth-pop-out-iccv2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "depth"
  - "iccv2023"
venue: "ICCV 2023"
source_url: "https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf"
---

## 오버뷰

Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다.

## 핵심 주장

- source data 없이 depth model만 이용해 object pop-out prior를 segmentation에 이식할 수 있다.
- contact surface representation을 통해 3D reasoning을 segmentation으로 연결한다.
- SOD와 COD 두 과제의 여덟 개 데이터셋에서 성능과 generalizability를 함께 개선한다.

## 초록

이 논문은 depth cue가 useful하지만 직접 depth를 구하기 어렵다는 현실에서 출발합니다. 저자들은 inferred depth map을 object pop-out prior와 결합해 3D space에서 객체를 reasoning하고, segmentation mask의 약한 supervision으로 contact surface를 학습합니다.

## 서론

COD에서 depth는 종종 보조 modality처럼 다뤄지지만, 이 논문은 RGB-D sensor가 없어도 얻을 수 있는 inferred depth를 적극 활용합니다. 그래서 source-free라는 표현이 붙습니다.

## 본론

핵심 아이디어는 객체가 배경 표면 위로 도드라져 나온다는 3D composition prior입니다. 이 prior를 잘 쓰면 appearance similarity가 큰 장면에서도 object boundaries를 더 잘 reasoning할 수 있습니다.

## 제안방법

저자들은 inferred depth map을 adaptation하고, contact surface intermediate representation을 학습해 purely 3D reasoning으로 object localization을 수행합니다. 이후 이 정보를 semantics와 연결해 segmentation 성능을 높입니다.

## 실험

이 논문은 여덟 개 데이터셋에 걸친 breadth를 강조합니다. COD 하나의 benchmark에 특화했다기보다, pop-out prior가 여러 related tasks에 통한다는 점을 보여줍니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| 8 datasets / 2 tasks | salient object detection과 camouflaged object detection을 합친 넓은 설정에서 성능과 generalizability 향상을 보고한다. |
| source-free depth setting | source dataset 접근 없이 depth model만 활용해 practical한 adaptation이 가능하다고 주장한다. |

## 결론

이 논문은 depth를 보조 input이 아니라, segmentation reasoning을 재구성하는 prior로 다룹니다. COD를 더 넓은 pop-out 문제로 보는 데 도움이 됩니다.

## 논의

최근 COD가 multimodal로 확장되는 흐름에서, 실제 센서가 없어도 쓸 수 있는 inferred depth prior라는 점이 꽤 매력적입니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf
