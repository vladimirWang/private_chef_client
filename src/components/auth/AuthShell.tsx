import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Apple, Sparkles, Sprout, TrendingUp } from "lucide-react";
import clsx from "clsx";
import { authBrand, authColors, authHighlights } from "@/theme/authTheme";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  altCta?: { preface: string; label: string; href: string };
};

const highlightIcons = [Sprout, TrendingUp, Apple] as const;

const spring = { type: "spring" as const, stiffness: 320, damping: 28 };

function useAuthMotion() {
  const reduce = useReducedMotion();
  return React.useMemo(
    () => ({
      heroContainer: {
        hidden: {},
        visible: {
          transition: reduce
            ? { duration: 0 }
            : { staggerChildren: 0.14, delayChildren: 0.2 },
        },
      } satisfies Variants,
      heroItem: {
        hidden: reduce ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -28, y: 16 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: reduce ? { duration: 0 } : spring,
        },
      } satisfies Variants,
      formPanel: {
        hidden: reduce ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, x: 48, y: 24, scale: 0.97 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: reduce ? { duration: 0 } : { ...spring, delay: 0.15 },
        },
      } satisfies Variants,
      formBlock: {
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: reduce
            ? { duration: 0 }
            : { ...spring, delay: 0.35 + i * 0.1 },
        }),
      } satisfies Variants,
      chipPop: {
        hidden: reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 },
        visible: (i: number) => ({
          opacity: 1,
          scale: 1,
          transition: reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 22, delay: 0.4 + i * 0.08 },
        }),
      } satisfies Variants,
    }),
    [reduce],
  );
}

function BrandMark({
  size = 40,
  delay = 0,
}: {
  size?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { scale: 0.6, opacity: 0, rotate: -12 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 400, damping: 18, delay }
      }
      className="flex shrink-0 items-center justify-center rounded-[14px] border border-white/30 bg-white/20 backdrop-blur-md"
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={reduce ? undefined : { rotate: [0, -6, 6, 0] }}
        transition={{ duration: 2.5, delay: delay + 0.6, ease: "easeInOut" }}
      >
        <Sprout size={size * 0.55} strokeWidth={2} aria-hidden />
      </motion.div>
    </motion.div>
  );
}

function HeroPanel({ variants }: { variants: ReturnType<typeof useAuthMotion> }) {
  return (
    <motion.div
      className="relative z-10"
      variants={variants.heroContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={variants.heroItem} className="mb-8 flex items-center gap-3">
        <BrandMark delay={0.25} />
        <motion.div variants={variants.heroItem}>
          <p className="text-lg font-bold leading-tight tracking-tight">
            {authBrand.name}
          </p>
          <p className="mt-0.5 text-xs text-white/85">
            青少年成长 · AI 膳食助手
          </p>
        </motion.div>
      </motion.div>

      <motion.h2
        variants={variants.heroItem}
        className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-4xl"
      >
        吃得对，
        <br />
        长得稳
      </motion.h2>

      <motion.p
        variants={variants.heroItem}
        className="mb-7 max-w-[380px] text-[0.95rem] leading-relaxed text-white/92"
      >
        {authBrand.tagline}
      </motion.p>

      <motion.ul
        variants={variants.heroContainer}
        className="flex flex-col gap-3"
      >
        {authHighlights.map((text, index) => {
          const Icon = highlightIcons[index] ?? Sparkles;
          return (
            <motion.li
              key={text}
              variants={variants.heroItem}
              className="flex items-start gap-2.5"
            >
              <motion.span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15"
                whileHover={{ scale: 1.12, backgroundColor: "rgba(255,255,255,0.25)" }}
              >
                <Icon size={15} strokeWidth={2.25} aria-hidden />
              </motion.span>
              <span className="text-sm leading-snug text-white/95">{text}</span>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}

function DecorativeBlobs() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-[-72px] h-[280px] w-[280px] rounded-full bg-white/10 blur-[1px]"
        animate={{ y: [0, -36, 0], x: [0, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-12 h-[200px] w-[200px] rounded-full bg-white/6"
        animate={{ y: [0, 28, 0], x: [0, -16, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[120px] right-8 h-[120px] w-[120px] rounded-3xl bg-amber-400/20"
        animate={{ rotate: [12, 24, 12], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function TagChip({
  icon,
  label,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export default function AuthShell({
  title,
  subtitle,
  children,
  altCta,
}: AuthShellProps) {
  const motionVariants = useAuthMotion();
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="flex min-h-dvh flex-col md:flex-row"
      style={{ background: authColors.pageBg }}
    >
      {/* Mobile header — 从上方滑入 */}
      <motion.header
        className="flex items-center gap-3 px-4 py-4 text-white md:hidden"
        style={{ background: authColors.heroGradient }}
        initial={reduce ? false : { opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { ...spring, duration: 0.55 }}
      >
        <BrandMark size={36} delay={0.1} />
        <motion.div
          className="min-w-0 flex-1"
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduce ? { duration: 0 } : { ...spring, delay: 0.2 }}
        >
          <p className="text-base font-bold leading-tight">{authBrand.name}</p>
          <p className="text-xs text-white/88">{authBrand.tagline}</p>
        </motion.div>
      </motion.header>

      {/* Desktop hero — 整列从左侧滑入 */}
      <motion.aside
        className="relative hidden flex-col justify-center overflow-hidden px-10 py-16 text-white md:flex md:max-w-[520px] md:flex-[0_0_44%] lg:px-14"
        style={{ background: authColors.heroGradient }}
        initial={reduce ? false : { opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={reduce ? { duration: 0 } : { ...spring, duration: 0.7 }}
      >
        <DecorativeBlobs />
        <HeroPanel variants={motionVariants} />
      </motion.aside>

      {/* Form area — 从右侧滑入 + 分块依次出现 */}
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 md:py-12">
        <motion.div
          className="w-full max-w-[440px]"
          variants={motionVariants.formPanel}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <motion.span
              variants={motionVariants.chipPop}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <TagChip
                icon={<Sparkles size={14} className="text-emerald-600" />}
                label="AI 膳食顾问"
                className="border-emerald-600/20 bg-emerald-600/10 text-emerald-800"
              />
            </motion.span>
            <motion.span
              variants={motionVariants.chipPop}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <TagChip
                label="4–10 岁成长营养"
                className="border-sky-400/20 bg-sky-400/10 text-sky-800"
              />
            </motion.span>
          </div>

          <motion.h1
            variants={motionVariants.formBlock}
            custom={0}
            className={clsx(
              "text-3xl font-extrabold tracking-tight text-slate-900",
              subtitle ? "mb-1" : "mb-6",
            )}
          >
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p
              variants={motionVariants.formBlock}
              custom={1}
              className="mb-6 leading-relaxed text-slate-500"
            >
              {subtitle}
            </motion.p>
          ) : null}

          <motion.div
            variants={motionVariants.formBlock}
            custom={subtitle ? 2 : 1}
            className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
            style={{
              borderColor: authColors.cardBorder,
              boxShadow: authColors.cardShadow,
            }}
            whileHover={
              reduce
                ? undefined
                : { y: -4, boxShadow: "0 20px 50px rgba(6, 78, 59, 0.14)" }
            }
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {children}
          </motion.div>

          {altCta ? (
            <motion.p
              variants={motionVariants.formBlock}
              custom={subtitle ? 3 : 2}
              className="mt-6 text-center text-sm text-slate-500"
            >
              {altCta.preface}{" "}
              <RouterLink
                to={altCta.href}
                className="font-semibold text-emerald-600 no-underline hover:underline"
              >
                {altCta.label}
              </RouterLink>
            </motion.p>
          ) : null}
        </motion.div>
      </main>
    </motion.div>
  );
}
