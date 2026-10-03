import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { typesetTitle } from '@/lib/keep-parens';
import { routes } from '@/lib/paths';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata = pageMetadata({
  title: '소개',
  description: '컴퓨터 비전을 연구하는 이지상의 블로그입니다.',
  path: routes.about()
});

const LINKS = [
  { label: 'GitHub', href: SITE.links.github, text: 'github.com/Kkubuck' },
  { label: 'Scholar', href: SITE.links.scholar, text: 'Google Scholar' },
  { label: 'LinkedIn', href: SITE.links.linkedin, text: 'linkedin.com/in/jisanglee' },
  { label: 'Email', href: `mailto:${SITE.links.email}`, text: SITE.links.email }
];

const PUBLICATIONS = [
  {
    title: 'HFGF-DINOv3: High-Frequency Guided Fusion and Phase-Aware Loss for Camouflaged Object Detection',
    venue: 'Pattern Recognition, 2026 (accepted)'
  },
  {
    title:
      'Uncertainty-Guided Structural Routing and Consensus-Aware Re-Ranking for Open-Vocabulary Camouflaged Object Segmentation',
    venue: 'ACCV 2026 (accepted)'
  },
  {
    title: 'Parcel-Based Crop Type Classification in UAV Imagery with SAM for Smallholder Farms',
    venue: 'Korean Journal of Remote Sensing, 2024'
  }
];

export default function AboutPage() {
  return (
    <div className="wrap">
      <header className="page-header">
        <h1 className="page-header__title">소개</h1>
      </header>

      <div className="about">
        <p className="about__name">
          이지상 <span>Jisang Lee</span>
        </p>
        <p>
          한밭대학교 컴퓨터공학과 석사과정이고, AIM Lab에서 컴퓨터 비전을 연구합니다. 배경과 구분하기 어려운 대상을 찾는
          문제에 관심이 많습니다. 위장 객체 탐지와 분할, SAR·UAV 영상 분석을 주로 다루고, 비전 기반 모델과 비전-언어 모델을
          이런 문제에 맞게 쓰는 방법을 고민합니다.
        </p>
        <p>
          이 블로그에는 읽은 논문의 리뷰와 공부하면서 정리한 내용을 올립니다. 예전 Tistory 블로그에 쓴 글도{' '}
          <Link href={routes.category('study')}>공부</Link>와{' '}
          <Link href={routes.category('coding-test')}>코딩 테스트</Link> 카테고리로 옮겨 두었습니다.
        </p>

        <h2>연락처</h2>
        <dl className="about__links">
          {LINKS.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <div key={link.label}>
                <dt>{link.label}</dt>
                <dd>
                  <a
                    href={link.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {link.text}
                  </a>
                </dd>
              </div>
            );
          })}
        </dl>

        <h2>최근 논문</h2>
        <ul className="about__pubs">
          {PUBLICATIONS.map((item) => (
            <li key={item.title}>
              <strong>{typesetTitle(item.title, 14)}</strong>
              <span>{item.venue}</span>
            </li>
          ))}
        </ul>
        <p className="about__more">
          전체 논문과 수상 목록은{' '}
          <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
            GitHub 프로필
          </a>
          에 정리해 두었습니다.
        </p>
      </div>
    </div>
  );
}
