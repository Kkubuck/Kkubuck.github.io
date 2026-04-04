---
layout: "post"
title: "VSCode: General Visual Salient and Camouflaged Object Detection with 2D Prompt Learning"
subtitle: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
summary: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
description: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
date: "2026-03-20 09:00:00 +0900"
slug: "vscode-generalist-cod-cvpr2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sod"
  - "cvpr2024"
venue: "CVPR 2024"
source_url: "https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf"
---

## 오버뷰

VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다.

## 핵심 주장

- SOD와 COD는 서로 닿아 있는 문제이므로 완전히 분리된 specialist 설계는 비효율적이다.
- 2D prompt learning으로 domain-specific 지식과 task-specific 지식을 따로 학습할 수 있다.
- 6개 task, 26개 데이터셋에서 SOTA를 넘고, RGB-D COD 같은 unseen task에도 zero-shot generalization을 보인다.

## 초록

기존 연구는 여러 salient/camouflaged detection task마다 복잡한 specialist를 두는 경향이 있습니다. VSCode는 이를 generalist framing으로 바꾸고, encoder-decoder 안에 2D prompts를 넣어 domain과 task라는 두 축의 지식을 동시에 학습합니다.

## 서론

이 논문은 COD만 따로 잘하는 모델보다, 비슷한 binary detection task를 함께 학습했을 때 더 일반적인 표현을 얻을 수 있다는 문제의식을 갖습니다. 그래서 task unification이 핵심 키워드입니다.

## 본론

VSCode의 장점은 SOD와 COD를 묶되, 서로 다른 부분까지 뭉개지 않게 2D prompt로 disentangle하는 데 있습니다. 즉 하나로 합치되, 아무렇게나 합치지 않는 전략입니다.

## 제안방법

저자들은 VST 기반 구조 안에 2D prompts를 넣고, prompt discrimination loss로 domain/task peculiarities를 분리해 학습합니다. 이 설계 덕분에 unseen task 조합에도 유연성이 생깁니다.

## 실험

대표 메시지는 breadth입니다. 단일 COD benchmark에서 소폭 이기는 것이 아니라, 26 datasets across six tasks와 zero-shot generalization을 함께 보여줍니다.

| 벤치마크 | 핵심 포인트 |
| --- | --- |
| 26 datasets / 6 tasks | RGB SOD, RGB-D SOD, video SOD, RGB COD, RGB-D COD 등 다수의 binary mapping task에서 generalist 성능을 보인다. |
| zero-shot unseen tasks | 학습하지 않은 task 조합에서도 2D prompts 결합으로 reasonable generalization을 보인다고 보고한다. |

## 결론

VSCode는 COD를 단독 작업으로만 보지 않고, broader visual pop-out 문제의 한 축으로 묶어 읽게 만드는 논문입니다.

## 논의

개별 benchmark 리더보드보다 범용성을 보려면 이런 generalist 계열이 더 중요해질 것 같습니다. 특히 future multimodal COD와도 잘 연결됩니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf
