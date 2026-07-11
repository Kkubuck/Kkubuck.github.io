---
title: Source-free Depth for Object Pop-out
description: PopNet은 pretrained monocular depth model을 source-free로 적응시킨다. contact surface를 약한 mask supervision으로
  학습해 3D에서 객체와 배경을 분리한다.
summary: PopNet은 pretrained monocular depth model을 source-free로 적응시킨다. contact surface를 약한 mask supervision으로 학습해
  3D에서 객체와 배경을 분리한다.
subtitle: 원래 depth 모델을 학습한 source data 없이도, 객체가 배경 표면에서 튀어나온다는 3D composition prior와 contact surface를 이용해 depth
  지식을 객체 분할로 옮긴 연구.
pubDate: 2026-03-17 09:00:00 +0900
slug: source-free-depth-pop-out-iccv2023
kind: paper
lang: ko
tags:
- paper
- depth
- source-free-adaptation
- cod
- sod
- iccv-2023
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html
venue: ICCV 2023
paperYear: 2023
authors: Zongwei Wu, Danda Pani Paudel, Deng-Ping Fan, Jingjing Wang, Shuo Wang, Cédric Demonceaux, Radu Timofte,
  Luc Van Gool
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf
codeUrl: https://github.com/Zongwei97/PopNet
takeaways:
- RGB 외형이 아닌 3D pop-out prior로 객체를 분리하고, 실제 depth sensor 대신 monocular depth model을 활용한다.
- 원 depth 학습 데이터 없이 모델만 가져와 적응하는 source-free 설정을 택한다.
- 객체가 배경 표면 위에 놓인다는 가정이 깨지는 평면 그림·구멍·투명체에서는 3D prior가 오해를 낳을 수 있다.
---

## 색이 같아도 깊이는 다를 수 있다

위장 객체가 배경과 같은 색과 질감을 가져도 실제 3차원 공간에서는 배경 표면보다 앞에 놓이는 경우가 많다. 이 논문은 그 단순한 **object pop-out prior**를 이용한다. 객체가 배경 surface 위에 존재한다면, depth geometry만으로도 외형에 묻힌 경계를 찾을 수 있다는 생각이다.

문제는 실제 depth sensor가 없는 이미지가 훨씬 많다는 점이다. 저자들은 monocular depth estimation model이 예측한 depth를 사용하되, 그 모델을 원래 학습한 source data는 요구하지 않는 source-free adaptation을 제안한다.

## depth map을 그대로 쓰지 않는 이유

범용 depth 모델은 장면의 상대 깊이는 잘 예측해도, segmentation에 필요한 객체 경계를 정확히 보존한다고 보장할 수 없다. 특히 위장 객체는 RGB 단서가 약해 monocular depth도 표면을 배경과 합칠 수 있다. 따라서 예측 depth를 보조 채널로 단순 concatenation하는 것만으로는 충분하지 않다.

PopNet은 객체가 놓인 **contact surface**라는 중간 표현을 도입한다. 어떤 배경 표면과 객체가 접하는지를 알면, 3D에서 그 표면보다 앞으로 나온 영역을 객체 후보로 분리할 수 있다. 이 contact surface는 segmentation mask의 약한 supervision으로 학습된다.

## source-free adaptation

source-free라는 말은 depth backbone의 weight는 사용할 수 있지만, 원래 depth dataset의 이미지와 라벨은 다시 볼 수 없다는 뜻이다. 데이터 라이선스, 저장 공간, 개인정보 문제 때문에 실제 배포 환경에서 의미 있는 설정이다.

저자들은 target segmentation 데이터만으로 depth representation을 조정한다. 목표는 절대 깊이 정확도를 높이는 것이 아니라, **객체와 배경을 3D에서 분리하기 좋은 depth**로 바꾸는 것이다. source task의 지식을 보존하면서 target task에 필요한 geometry를 강조한다.

## SOD와 COD를 함께 평가한 이유

논문은 salient object detection과 camouflaged object detection의 여러 데이터셋에서 방법을 평가한다. 두 작업은 RGB 대비가 서로 다르지만, 객체가 배경 표면에서 분리된다는 3D composition prior는 공유할 수 있다. 양쪽에서 이득이 나타난다면 depth cue가 특정 COD 데이터셋의 질감 편향에만 의존한 것이 아니라는 근거가 된다.

실험을 볼 때는 RGB-only baseline, raw predicted depth를 넣은 baseline, source-free adaptation을 적용한 모델을 구분해야 한다. 단순히 modality가 하나 늘어난 효과와 contact-surface reasoning의 효과를 분리하는 것이 핵심이다.

## 좋은 점과 활용 범위

이 연구는 대형 pretrained model을 새 과업에 옮길 때 source data가 반드시 필요하지 않다는 실용적인 경로를 보여 준다. depth model의 출력 자체보다 그 안의 3D 지식을 semantic segmentation에 맞게 재구성한다는 점도 중요하다.

원격탐사, 로봇, 의료 영상처럼 RGB appearance가 불안정한 분야에서도 geometry prior를 찾을 수 있다면 비슷한 접근이 가능하다. 다만 각 도메인에서 ‘배경 표면’이 무엇인지 먼저 정의해야 한다.

## prior가 깨지는 경우

벽에 그려진 그림, 구멍, 그림자, 투명체처럼 시각적 객체가 배경 surface보다 앞에 있지 않은 장면에서는 pop-out 가정이 맞지 않는다. monocular depth의 scale ambiguity와 얇은 구조 손실도 남는다. mask supervision을 사용하므로 완전한 무감독 학습은 아니다. 실제 일반화를 판단하려면 depth model 종류가 바뀌었을 때의 민감도와 3D prior가 실패하는 장면별 분석이 필요하다.
