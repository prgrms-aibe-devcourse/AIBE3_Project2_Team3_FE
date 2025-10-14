"use client";

import { useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

type PaginationProps = {
  pageIndex: number;
  pageCount: number;
  onPageIndexChange: (p: number) => void;
  siblingCount?: number;
};

function getPageItems(totalPages: number, current: number, siblingCount = 1) {
  const range = (s: number, e: number) =>
    Array.from({ length: e - s + 1 }, (_, i) => s + i);
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) return range(1, totalPages);

  const left = Math.max(current - siblingCount, 1);
  const right = Math.min(current + siblingCount, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  if (!showLeftDots && showRightDots)
    return [...range(1, 3 + 2 * siblingCount), "dots", totalPages] as const;
  if (showLeftDots && !showRightDots)
    return [
      1,
      "dots",
      ...range(totalPages - (2 * siblingCount + 2), totalPages),
    ] as const;
  return [1, "dots", ...range(left, right), "dots", totalPages] as const;
}

function PaginationBar({
  pageIndex,
  pageCount,
  onPageIndexChange,
  siblingCount = 1,
}: PaginationProps) {
  // 0-base → 1-base 표시값
  const displayPage = pageIndex + 1; // 1..pageCount
  const totalPages = pageCount; // 그대로 개수 = 최대 표시 페이지

  const items = useMemo(
    () => getPageItems(totalPages, displayPage, siblingCount),
    [totalPages, displayPage, siblingCount],
  );

  // pageCount가 0이면 아예 렌더 안함(선택)
  if (pageCount <= 0) return null;

  const prevDisabled = pageIndex <= 0;
  const nextDisabled = pageIndex >= pageCount - 1;

  const handleDisplayClick = (p1: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    const nextIndex = p1 - 1; // 1-base → 0-base
    if (nextIndex >= 0 && nextIndex < pageCount && nextIndex !== pageIndex) {
      onPageIndexChange(nextIndex);
    }
  };

  return (
    <Pagination aria-label="Pagination Navigation">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href="#"
            aria-label="Go to previous page"
            onClick={(e) => {
              e.preventDefault();
              if (!prevDisabled) onPageIndexChange(0);
            }}
            className={
              prevDisabled ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={prevDisabled || undefined}
            tabIndex={prevDisabled ? -1 : 0}
            size="default"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-label="Go to previous page"
            onClick={(e) => {
              e.preventDefault();
              if (!prevDisabled) onPageIndexChange(pageIndex - 1);
            }}
            className={
              prevDisabled ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={prevDisabled || undefined}
            tabIndex={prevDisabled ? -1 : 0}
            size="default"
          />
        </PaginationItem>

        {items.map((it, idx) => (
          <PaginationItem key={`${it}-${idx}`}>
            {it === "dots" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={it === displayPage}
                onClick={handleDisplayClick(it as number)}
              >
                {it}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-label="Go to next page"
            onClick={(e) => {
              e.preventDefault();
              if (!nextDisabled) onPageIndexChange(pageIndex + 1);
            }}
            className={
              nextDisabled ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={nextDisabled || undefined}
            tabIndex={nextDisabled ? -1 : 0}
            size="default"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            href="#"
            aria-label="Go to previous page"
            onClick={(e) => {
              e.preventDefault();
              if (!nextDisabled) onPageIndexChange(totalPages - 1);
            }}
            className={
              nextDisabled ? "pointer-events-none opacity-50" : undefined
            }
            aria-disabled={nextDisabled || undefined}
            tabIndex={nextDisabled ? -1 : 0}
            size="default"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { PaginationBar };
