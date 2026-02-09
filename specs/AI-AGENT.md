# AI-AGENT ??AI ?ì´?„íŠ¸ ëª¨ë“ˆ ?ì„¸ ?¤í™

## 1. ëª©ì ê³?ë²”ìœ„

ë°”ì´ë¸Œì½”?©ì„ ?„í•œ AI ?ì´?„íŠ¸ ë£°ì…‹ê³??„ë¦¬?‹ì„ ?œê³µ?œë‹¤. ?¹ì • IDE/?„êµ¬??ì¢…ì†?˜ì? ?ŠëŠ” ë²”ìš© `AGENTS.md` ?Œì¼???ì„±?˜ë©°, ?œë¸Œ?ì´?„íŠ¸ ì»¤ë§¨???„ë¦¬?‹ì„ ?¬í•¨?œë‹¤.

> **?ì¹™:** Cursor, Copilot, Windsurf ???¹ì • ?„ë¡œê·¸ë¨??ì¢…ì†?˜ì? ?ŠëŠ”?? ?´ë–¤ AI ì½”ë”© ?„êµ¬?ì„œ???œìš© ê°€?¥í•œ ë²”ìš© AGENTS.mdë¥??ì„±?œë‹¤.

## 2. ?¨í‚¤ì§€ êµ¬ì¡°

```
packages/ai-agent/
?œâ??€ src/
??  ?œâ??€ index.ts
??  ?œâ??€ presets.ts              # ?„ë¦¬???•ì˜
??  ?œâ??€ rules.ts                # ë£°ì…‹ ?•ì˜
??  ?œâ??€ generators/
??  ??  ?œâ??€ agents-md.ts        # AGENTS.md ?ì„±ê¸???  ??  ?”â??€ subagent-commands.ts # ?œë¸Œ?ì´?„íŠ¸ ì»¤ë§¨???ì„±ê¸???  ?”â??€ templates/
??      ?œâ??€ agents-md.hbs       # AGENTS.md ?œí”Œë¦???      ?œâ??€ feature-builder.hbs # ?œë¸Œ?ì´?„íŠ¸: ê¸°ëŠ¥ êµ¬í˜„
??      ?œâ??€ bug-fixer.hbs       # ?œë¸Œ?ì´?„íŠ¸: ë²„ê·¸ ?˜ì •
??      ?”â??€ code-reviewer.hbs   # ?œë¸Œ?ì´?„íŠ¸: ì½”ë“œ ë¦¬ë·°
?œâ??€ package.json
?”â??€ tsconfig.json
```

## 3. ?ì„¸ ?”êµ¬?¬í•­

### 3.1 AGENTS.md ?ì„±ê¸?
?„ë¡œ?íŠ¸ ?¤ì •??ë§ëŠ” ë²”ìš© `AGENTS.md` ?Œì¼???ë™ ?ì„±?œë‹¤. ???Œì¼?€ ?´ë–¤ AI ì½”ë”© ?„êµ¬?ì„œ???„ë¡œ?íŠ¸ ì»¨í…?¤íŠ¸ë¡??œìš©?œë‹¤.

```typescript
interface AgentsMdConfig {
  projectName: string;
  description: string;
  techStack: string[];           // ['next15', 'supabase', 'drizzle', 'tailwind', 'shadcn']
  packages: string[];
  language: 'ko' | 'en';        // ?‘ë‹µ ?¸ì–´
  codeStyle: {
    semicolons: boolean;         // ê¸°ë³¸: true
    quotes: 'single' | 'double'; // ê¸°ë³¸: 'single'
    indentSize: number;          // ê¸°ë³¸: 2
  };
  customInstructions?: string;   // ì¶”ê? ì§€ì¹?}

function generateAgentsMd(config: AgentsMdConfig): string
```

#### ê¸°ë³¸ AGENTS.md ?´ìš©

```markdown
# AGENTS.md ??{projectName}

> ???Œì¼?€ AI ì½”ë”© ?ì´?„íŠ¸ë¥??„í•œ ?„ë¡œ?íŠ¸ ê°€?´ë“œ?…ë‹ˆ??
> Cursor, Copilot, Windsurf, Claude Code ???´ë–¤ ?„êµ¬?ì„œ???œìš©?????ˆìŠµ?ˆë‹¤.

## ?„ë¡œ?íŠ¸ ê°œìš”
{description}

## ê¸°ìˆ  ?¤íƒ
- Next.js 16 (App Router, Server Components, Server Actions)
- TypeScript (strict mode)
- Supabase (Auth + PostgreSQL)
- Drizzle ORM
- Tailwind CSS + shadcn/ui
- ? ìŠ¤?˜ì´ë¨¼ì¸ 

## ?„ë¡œ?íŠ¸ êµ¬ì¡°
```
apps/web/          ??ë©”ì¸ Next.js ??packages/core/     ??ê³µí†µ Provider, ?ˆì´?„ì›ƒ, UI
packages/db/       ??Drizzle ?¤í‚¤ë§? ë§ˆì´ê·¸ë ˆ?´ì…˜
packages/auth/     ??Supabase ?¸ì¦
packages/admin/    ??ê´€ë¦¬ì ?€?œë³´??packages/payment/  ??? ìŠ¤?˜ì´ë¨¼ì¸  ê²°ì œ
packages/ai-agent/ ????ëª¨ë“ˆ (AI ?ì´?„íŠ¸ ?„ë¦¬??
specs/             ???¤í™ ë¬¸ì„œ (Spec Driven Development)
```

## ì½”ë“œ ì»¨ë²¤??- ?¨ìˆ˜??ì»´í¬?ŒíŠ¸ë§??¬ìš© (no class components)
- Server Components ê¸°ë³¸, 'use client' ìµœì†Œ??- Server Actions for mutations
- named export ? í˜¸
- ?Œì¼ëª? kebab-case
- ì»´í¬?ŒíŠ¸: PascalCase
- zodë¡?ëª¨ë“  ?…ë ¥ ê²€ì¦?- ?ëŸ¬??try-catchë¡?ì²˜ë¦¬, ?¬ìš©??ì¹œí™”??ë©”ì‹œì§€

## ?ì£¼ ?¬ìš©?˜ëŠ” ?¨í„´

### Server Action
```typescript
'use server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@ohmynextjs/auth';

const schema = z.object({ /* ... */ });

export async function myAction(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: { code: 'VALIDATION', message: parsed.error.message } };
  // ...
  return { data: result };
}
```

### DB ì¿¼ë¦¬
```typescript
import { db } from '@ohmynextjs/db';
import { users } from '@ohmynextjs/db/schema';
import { eq } from 'drizzle-orm';

const user = await db.select().from(users).where(eq(users.id, userId));
```

### ?¸ì¦ ì²´í¬
```typescript
import { createSupabaseServerClient } from '@ohmynextjs/auth';

const supabase = await createSupabaseServerClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect('/login');
```

## ê·œì¹™
- ???Œì¼ ?ì„± ???´ë‹¹ ?¨í‚¤ì§€??index.ts??export ì¶”ê?
- DB ë³€ê²???ë°˜ë“œ??ë§ˆì´ê·¸ë ˆ?´ì…˜ ?ì„±
- API ?‘ë‹µ?€ `{ data }` ?ëŠ” `{ error: { code, message } }` ?•ì‹
- ?œêµ­???¬ìš©???€?? UI ?ìŠ¤?¸ëŠ” ?œêµ­??- ?¤í™ ë¬¸ì„œ(specs/)ë¥?ë¨¼ì? ?•ì¸?˜ê³  êµ¬í˜„

## ì»¤ë°‹ ì»¨ë²¤??- feat: ??ê¸°ëŠ¥
- fix: ë²„ê·¸ ?˜ì •
- refactor: ë¦¬íŒ©? ë§
- docs: ë¬¸ì„œ
- chore: ?¤ì •/ë¹Œë“œ
```

### 3.2 ?œë¸Œ?ì´?„íŠ¸ ì»¤ë§¨???„ë¦¬??
?œë¸Œ?ì´?„íŠ¸??AGENTS.mdë¥?ì»¨í…?¤íŠ¸ë¡??œìš©?˜ë©°, ?¹ì • ?‘ì—…???¹í™”??ì§€ì¹¨ì„ ?œê³µ?œë‹¤.

#### feature-builder
```
ëª©ì : ??ê¸°ëŠ¥??êµ¬í˜„?˜ëŠ” ?ì´?„íŠ¸
?…ë ¥: ê¸°ëŠ¥ ?¤ëª…, ê´€???¨í‚¤ì§€
?™ì‘:
1. AGENTS.md?€ specs/ ?”ë ‰? ë¦¬?ì„œ ê´€???¤í™ ?•ì¸
2. ?„ìš”??DB ?¤í‚¤ë§?ë³€ê²?3. ?œë²„ ?¡ì…˜ êµ¬í˜„
4. ì»´í¬?ŒíŠ¸ êµ¬í˜„
5. ?¼ìš°??ì¶”ê?
6. ?¨í‚¤ì§€ index.ts export ?…ë°?´íŠ¸
```

#### bug-fixer
```
ëª©ì : ë²„ê·¸ë¥?ë¶„ì„?˜ê³  ?˜ì •?˜ëŠ” ?ì´?„íŠ¸
?…ë ¥: ?ëŸ¬ ë©”ì‹œì§€, ?¬í˜„ ê²½ë¡œ
?™ì‘:
1. AGENTS.md?ì„œ ?„ë¡œ?íŠ¸ êµ¬ì¡°/?¨í„´ ?Œì•…
2. ?ëŸ¬ ë¡œê·¸ ë¶„ì„
3. ê´€??ì½”ë“œ ?ìƒ‰
4. ?ì¸ ?Œì•…
5. ?˜ì • ì½”ë“œ ?‘ì„±
6. ?¬ì´???´í™??ì²´í¬
```

#### code-reviewer
```
ëª©ì : ì½”ë“œ ë¦¬ë·°ë¥??˜í–‰?˜ëŠ” ?ì´?„íŠ¸
?…ë ¥: ë³€ê²½ëœ ?Œì¼ ëª©ë¡ ?ëŠ” PR
?™ì‘:
1. AGENTS.md?ì„œ ì½”ë“œ ì»¨ë²¤???•ì¸
2. ë³€ê²??¬í•­ ë¶„ì„
3. ì»¨ë²¤??ì¤€???¬ë? ì²´í¬
4. ë³´ì•ˆ ?´ìŠˆ ì²´í¬
5. ?±ëŠ¥ ?´ìŠˆ ì²´í¬
6. ê°œì„  ?œì•ˆ
```

### 3.3 CLI ?¤í¬ë¦½íŠ¸

```json
// package.json scripts
{
  "generate:agents-md": "tsx src/generators/agents-md.ts",
  "generate:all": "tsx src/generators/agents-md.ts"
}
```

?¤ì •?€ ?„ë¡œ?íŠ¸ ë£¨íŠ¸??`ohmynextjs.config.ts`?ì„œ ?½ê±°??ê¸°ë³¸ê°??¬ìš©:

```typescript
// ohmynextjs.config.ts (? íƒ??
import { defineConfig } from '@ohmynextjs/ai-agent';

export default defineConfig({
  projectName: 'MyProject',
  language: 'ko',
  // ... ì»¤ìŠ¤?€ ?¤ì •
});
```

## 4. ?˜ì¡´??
```json
{
  "dependencies": {},
  "devDependencies": {
    "tsx": "^4"
  }
}
```

?°í????˜ì¡´???†ìŒ. ë¹Œë“œ ?€??CLI ?„êµ¬ë§?

## 5. Export

```typescript
export { generateAgentsMd } from './generators/agents-md';
export { getSubagentPreset } from './generators/subagent-commands';
export { defaultRules } from './rules';
export { defaultPresets } from './presets';
export type { AgentsMdConfig } from './types';
```

## 6. ?ëŸ¬ ì²˜ë¦¬

- ?¤ì • ?Œì¼ ë¯¸ì¡´???? ê¸°ë³¸ê°’ìœ¼ë¡??ì„± + ê²½ê³  ë©”ì‹œì§€
- ì¶œë ¥ ê²½ë¡œ??ê¸°ì¡´ ?Œì¼ ì¡´ì¬ ?? ë°±ì—… ????–´?°ê¸° (`.bak` ?Œì¼)

## 7. êµ¬í˜„ ?°ì„ ?œìœ„

1. ê¸°ë³¸ ë£°ì…‹/?„ë¦¬???•ì˜
2. `AGENTS.md` ?ì„±ê¸?3. ?œë¸Œ?ì´?„íŠ¸ ?„ë¦¬??4. CLI ?¤í¬ë¦½íŠ¸
