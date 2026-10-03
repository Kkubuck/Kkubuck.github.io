/**
 * Shiki theme for post code blocks: the prototype's palette as CSS variables.
 *
 * Every colour is a var() reference to a token in src/app/globals.css (--code-ink,
 * --t-kw, …), which switch with the light/dark theme. One theme therefore serves both
 * colour schemes, and the HTML carries no colours of its own (Shiki keeps var()
 * values as written). Each token is ≥ 4.5:1 on --code-bg in both themes:
 *
 *            light            dark
 *   ink      #2A2A30 13.8:1   #E1E1E6 14.2:1   identifiers, punctuation, modules
 *   kw       #B3245F  6.1:1   #FF7FAA  7.8:1   keywords, def/class, import, storage
 *   fn       #1F55C4  6.4:1   #8DB3FF  8.9:1   names being defined, decorators
 *   str      #2C7646  5.4:1   #8ED19F 10.4:1   strings, docstrings
 *   num      #A0520A  5.5:1   #F0B272 10.0:1   numbers, True/False/None, options
 *   com      #72727B  4.6:1   #84848F  5.0:1   comments
 *   bi       #0B6C7E  5.9:1   #6FCFDD 10.3:1   builtins and types (print, float, int)
 *   op       #6A6A74  5.2:1   #9A9AA4  6.7:1   operators
 */
import type { ThemeRegistration } from 'shiki';

const v = (name: string) => `var(--${name})`;

export const codeTheme: ThemeRegistration = {
  name: 'kkubuck-paper',
  type: 'light',
  colors: {
    'editor.foreground': v('code-ink'),
    'editor.background': v('code-bg')
  },
  fg: v('code-ink'),
  bg: v('code-bg'),
  tokenColors: [
    { settings: { foreground: v('code-ink') } },
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: v('t-com') }
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.other',
        'keyword.operator.logical.python',
        'keyword.operator.new',
        'keyword.operator.sizeof',
        'storage',
        'storage.type',
        'storage.modifier',
        'variable.language.this',
        'punctuation.definition.directive'
      ],
      settings: { foreground: v('t-kw') }
    },
    {
      scope: ['keyword.operator', 'punctuation.separator.annotation.result.python'],
      settings: { foreground: v('t-op') }
    },
    {
      scope: [
        'entity.name.function',
        'meta.function.python entity.name.function',
        'entity.name.function.decorator',
        'punctuation.definition.decorator',
        'meta.function.decorator support.type'
      ],
      settings: { foreground: v('t-fn') }
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'constant.character.escape'],
      settings: { foreground: v('t-str') }
    },
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.character.format.placeholder',
        'constant.other.option',
        'storage.type.string.python',
        'storage.type.format.python'
      ],
      settings: { foreground: v('t-num') }
    },
    {
      scope: [
        'support.function.builtin',
        'support.type',
        'support.class',
        'entity.name.type',
        'entity.other.inherited-class',
        'storage.type.primitive',
        'storage.type.built-in',
        'variable.other.normal.shell',
        'variable.other.special.shell',
        'variable.other.positional.shell'
      ],
      settings: { foreground: v('t-bi') }
    },
    {
      scope: ['entity.name.namespace', 'entity.name.scope-resolution', 'variable.parameter', 'meta.function-call.generic'],
      settings: { foreground: v('code-ink') }
    }
  ]
};
