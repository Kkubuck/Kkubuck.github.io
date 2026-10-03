---
title: 'PopNet: Source-free Depth for Object Pop-out'
description: 사전학습된 깊이 추정 모델을 원래 학습 데이터 없이 적응시켜, 객체가 배경 표면 위로 "튀어나와" 있다는 3D 사전 지식으로 객체를 분할한다.
pubDate: 2026-03-17 09:00:00 +0900
category: paper-review
tags: [cod, sod, depth]
takeaways:
  - 깊이를 직접 재기는 어렵지만, 학습 기반 깊이 추정 모델은 실제 환경에서도 쓸 만한 깊이 지도를 준다.
  - 객체가 배경 표면 위에 놓여 있다는 pop-out 사전 지식으로, 3D 정보만으로 객체를 찾을 수 있도록 깊이 지도를 적응시킨다.
  - 깊이 모델만 있으면 되고 그 모델의 학습 데이터(source data)는 필요 없어, SOD와 COD 8개 데이터셋에서 성능과 일반화가 모두 좋아졌다.
paper:
  title: Source-free Depth for Object Pop-out
  authors: Zongwei Wu, Danda Pani Paudel, Deng-Ping Fan, Jingjing Wang, Shuo Wang, Cédric Demonceaux, Radu Timofte, Luc Van Gool
  venue: ICCV 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf
  code: https://github.com/Zongwei97/PopNet
---

## 문제

깊이 정보는 사물을 인식하는 데 유용하지만, 실제로 깊이를 측정하기는 어렵다. 대신 요즘 학습 기반 깊이 추정 모델은 실제 환경 이미지에서도 꽤 괜찮은 깊이 지도를 추론해 준다. 이 논문은 이런 깊이 추정 모델을 **객체 분할에 맞게 적응**시키는 방법을 다룬다. 위장 객체는 RGB로는 배경과 구분되지 않아도, 3D 공간에서는 배경 위에 떠 있는 경우가 많다.

## 방법

### Pop-out 사전 지식

"**객체는 배경 표면 위에 놓여 있다**"는 단순한 구성 사전 지식(composition prior)을 쓴다. 이 가정 덕분에 객체를 3D 공간에서 추론할 수 있다. 저자들은 추론된 깊이 지도를 적응시켜, **3D 정보만으로** 객체의 위치를 찾을 수 있게 만든다.

### 접촉 표면 학습

객체와 배경을 3D로 분리하려면 객체가 놓인 **접촉 표면**(contact surface)을 알아야 한다. 접촉 표면은 분할 마스크를 약한 감독 신호로 써서 학습한다. 이 중간 표현 덕분에 순수하게 3D로 객체를 추론할 수 있고, 깊이 지식이 의미 정보로 더 잘 옮겨진다.

### Source-free

적응 과정에는 **깊이 모델만** 필요하고, 그 모델을 학습시킨 원래 데이터(source data)는 필요 없다. 깊이 추정 모델을 학습시킨 대규모 데이터를 다시 내려받거나 함께 학습할 필요가 없어 효율적이고 실용적이다.

## 실험

현저 객체 탐지(SOD)와 위장 객체 탐지(COD) 두 작업의 8개 데이터셋에서 성능과 일반화 능력이 일관되게 좋아졌다.

## 정리

RGB-D COD처럼 깊이 센서가 있어야 하는 설정이 아니라, **추정한 깊이**를 사전 지식과 함께 쓴다는 점이 실용적이다. "객체는 배경 위로 튀어나와 있다"는 가정은 단순하지만, 색과 질감이 같은 위장 객체에 RGB와는 다른 축의 단서를 준다.

반대로 이 가정이 깨지는 장면, 예를 들어 평평한 나무껍질에 붙은 나방처럼 배경과 깊이 차이가 거의 없는 위장 객체에서는 효과가 제한될 수 있다. 깊이 추정 모델 자체의 오류도 그대로 전달된다.
