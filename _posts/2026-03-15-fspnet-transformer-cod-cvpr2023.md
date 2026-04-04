---
layout: "post"
title: "Feature Shrinkage Pyramid for Camouflaged Object Detection With Transformers"
subtitle: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
summary: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
description: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
date: "2026-03-15 09:00:00 +0900"
slug: "fspnet-transformer-cod-cvpr2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "transformer"
  - "cvpr2023"
venue: "CVPR 2023"
source_url: "https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf"
---

## 오버뷰

FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다.

## 핵심 주장

- ViT 계열의 global context만으로는 COD의 subtle local cue를 충분히 살리기 어렵다.
- NL-TEM이 neighboring tokens 간 상호작용과 고차 관계를 통해 locality를 강화한다.
- feature shrinkage pyramid decoder가 transformer feature를 점진적으로 압축하며 더 좋은 decoding을 만든다.

## 초록

이 논문은 transformer 기반 COD에서 locality modeling과 decoder aggregation 부족을 핵심 병목으로 봅니다. 그래서 non-local token enhancement와 feature shrinkage pyramid를 결합해 locality-enhanced neighboring transformer feature를 계층적으로 decode합니다.

## 서론

2023년 시점의 COD에서는 CNN과 transformer의 장단점이 비교적 명확해졌고, FSPNet은 transformer의 빈틈을 메우려는 설계로 읽힙니다.

## 본론

FSPNet은 큰 구조 혁신보다, transformer가 놓치는 local relation을 어떻게 보강할지를 세밀하게 다듬습니다. COD처럼 경계와 미세한 texture가 중요한 문제에서 이런 접근이 잘 맞습니다.

## 제안방법

NL-TEM이 non-local mechanism과 graph-based high-order relation으로 token locality를 높이고, feature shrinkage pyramid가 이를 progressive shrinking으로 decode합니다.

## 실험

실험의 메시지는 transformer backbone을 COD에 맞게 손보면 local cue와 decoding 문제를 줄일 수 있다는 것입니다.

### 메인 실험 결과

Table 1. Quantitative comparison with 24 SOTA methods on three benchmark datasets.

| 구분 | 모델 | CAMO (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) | COD10K (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) | NC4K (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) |
| --- | --- | --- | --- | --- |
| Salient Object Detection | BASNet19 | .618 .413 .475 .661 .708 .159 | .634 .365 .417 .678 .735 .105 | .695 .546 .610 .762 .786 .095 |
| Salient Object Detection | CPD19 | .716 .556 .618 .723 .796 .113 | .750 .531 .595 .776 .853 .053 | .717 .551 .597 .724 .793 .092 |
| Salient Object Detection | EGNet19 | .662 .495 .567 .683 .780 .125 | .733 .519 .583 .761 .836 .055 | .767 .626 .689 .793 .850 .077 |
| Salient Object Detection | SCRN19 | .779 .643 .705 .797 .850 .090 | .789 .575 .651 .817 .880 .047 | .830 .698 .757 .854 .897 .059 |
| Salient Object Detection | F3Net20 | .711 .564 .616 .741 .780 .109 | .739 .544 .593 .795 .819 .051 | .780 .656 .705 .824 .848 .070 |
| Salient Object Detection | CSNet20 | .771 .642 .705 .795 .849 .092 | .778 .569 .635 .810 .871 .047 | .750 .603 .655 .773 .793 .088 |
| Salient Object Detection | SSAL20 | .644 .493 .579 .721 .780 .126 | .668 .454 .527 .768 .789 .066 | .699 .561 .644 .780 .812 .093 |
| Salient Object Detection | ITSD20 | .750 .610 .663 .780 .830 .102 | .767 .557 .615 .808 .861 .051 | .811 .680 .729 .845 .883 .064 |
| Salient Object Detection | UCNet20 | .739 .640 .700 .787 .820 .094 | .776 .633 .681 .857 .867 .042 | .811 .729 .775 .871 .886 .055 |
| Salient Object Detection | VST21 | .787 .691 .738 .838 .866 .076 | .781 .604 .653 .837 .877 .042 | .831 .732 .771 .877 .901 .050 |
| Camouflaged Object Detection | SINet20 | .751 .606 .675 .771 .831 .100 | .771 .551 .634 .806 .868 .051 | .808 .723 .769 .871 .883 .058 |
| Camouflaged Object Detection | SLSR21 | .787 .696 .744 .838 .854 .080 | .804 .673 .715 .880 .892 .037 | .840 .766 .804 .895 .907 .048 |
| Camouflaged Object Detection | PFNet21 | .782 .695 .746 .842 .855 .085 | .800 .660 .701 .877 .890 .040 | .829 .745 .784 .888 .898 .053 |
| Camouflaged Object Detection | MGL-R21 | .775 .673 .726 .812 .842 .088 | .814 .666 .711 .852 .890 .035 | .833 .740 .782 .867 .893 .052 |
| Camouflaged Object Detection | UJSC21 | .800 .728 .772 .859 .873 .073 | .809 .684 .721 .884 .891 .035 | .842 .771 .806 .898 .907 .047 |
| Camouflaged Object Detection | C2FNet21 | .796 .719 .762 .854 .864 .080 | .813 .686 .723 .890 .900 .036 | .838 .762 .795 .897 .904 .049 |
| Camouflaged Object Detection | UGTR21 | .784 .684 .735 .822 .851 .086 | .817 .666 .712 .853 .890 .036 | .839 .747 .787 .875 .899 .052 |
| Camouflaged Object Detection | PreyNet22 | .790 .708 .757 .842 .857 .077 | .813 .697 .736 .881 .891 .034 | – – – – – – |
| Camouflaged Object Detection | BSA-Net22 | .794 .717 .763 .851 .867 .079 | .818 .699 .738 .891 .901 .034 | .841 .771 .808 .897 .907 .048 |
| Camouflaged Object Detection | OCE-Net22 | .802 .723 .766 .852 .865 .080 | .827 .707 .741 .894 .905 .033 | .853 .785 .818 .903 .913 .045 |
| Camouflaged Object Detection | BGNet22 | .812 .749 .789 .870 .882 .073 | .831 .722 .753 .901 .911 .033 | .851 .788 .820 .907 .916 .044 |
| Camouflaged Object Detection | SegMaR22 | .815 .753 .795 .874 .884 .071 | .833 .724 .757 .899 .906 .034 | .841 .781 .820 .896 .907 .046 |
| Camouflaged Object Detection | ZoomNet22 | .820 .752 .794 .878 .892 .066 | .838 .729 .766 .888 .911 .029 | .853 .784 .818 .896 .912 .043 |
| Camouflaged Object Detection | SINet-v222 | .820 .743 .782 .882 .895 .070 | .815 .680 .718 .887 .906 .037 | .847 .770 .805 .903 .914 .048 |
| Camouflaged Object Detection | Ours | .856 .799 .830 .899 .928 .050 | .851 .735 .769 .895 .930 .026 | .879 .816 .843 .915 .937 .035 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.
## 결론

FSPNet은 transformer 기반 COD의 약점을 정면으로 고친 실전형 논문입니다.

## 논의

지금 보면 더 큰 foundation model이 많지만, local cue를 어떻게 붙이느냐는 여전히 남아 있는 문제라서 읽을 가치가 있습니다.

## 출처
- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf
