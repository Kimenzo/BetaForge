// ===========================================
// 🚀 VIRTUAL LIST COMPONENT
// Efficient rendering of large lists
// ===========================================

"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  type ReactNode,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the container in pixels */
  containerHeight: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Number of items to render outside visible area */
  overscan?: number;
  /** Container className */
  className?: string;
  /** Key extractor function */
  getKey?: (item: T, index: number) => string | number;
  /** Callback when scrolled to bottom */
  onEndReached?: () => void;
  /** Threshold for onEndReached (px from bottom) */
  onEndReachedThreshold?: number;
  /** Empty state component */
  emptyComponent?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Loading component */
  loadingComponent?: ReactNode;
}

/**
 * High-performance virtual list component
 * Only renders visible items + overscan buffer
 */
export const VirtualList = memo(function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
  getKey,
  onEndReached,
  onEndReachedThreshold = 100,
  emptyComponent,
  isLoading,
  loadingComponent,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const endReachedRef = useRef(false);

  // Calculate visible range
  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);
    const offsetY = startIndex * itemHeight;

    return { startIndex, endIndex, totalHeight, offsetY };
  }, [items.length, itemHeight, containerHeight, scrollTop, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, i) => ({
      item,
      index: startIndex + i,
    }));
  }, [items, startIndex, endIndex]);

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setScrollTop(scrollTop);

    // Check if scrolled to end
    if (onEndReached && !endReachedRef.current) {
      const distanceFromEnd = scrollHeight - scrollTop - clientHeight;
      if (distanceFromEnd < onEndReachedThreshold) {
        endReachedRef.current = true;
        onEndReached();
      }
    }
  }, [onEndReached, onEndReachedThreshold]);

  // Reset end reached flag when items change
  useEffect(() => {
    endReachedRef.current = false;
  }, [items.length]);

  // Attach scroll listener with passive option for performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Empty state
  if (items.length === 0 && !isLoading) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height: containerHeight }}>
        {emptyComponent || <p className="text-phantom-gray">No items to display</p>}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto will-change-scroll", className)}
      style={{ height: containerHeight }}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: "relative" }}>
        {/* Visible items container */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px) translateZ(0)`,
            willChange: "transform",
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={getKey ? getKey(item, index) : index}
              style={{ height: itemHeight }}
              className="contain-layout"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-4">
          {loadingComponent || (
            <div className="w-6 h-6 border-2 border-neural/30 border-t-neural rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}) as <T>(props: VirtualListProps<T>) => ReactNode;

/**
 * Simple virtualized grid for cards/tiles
 */
interface VirtualGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerHeight: number;
  containerWidth: number;
  renderItem: (item: T, index: number) => ReactNode;
  gap?: number;
  overscan?: number;
  className?: string;
  getKey?: (item: T, index: number) => string | number;
}

export const VirtualGrid = memo(function VirtualGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerHeight,
  containerWidth,
  renderItem,
  gap = 16,
  overscan = 2,
  className,
  getKey,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate grid dimensions
  const columnsCount = Math.floor((containerWidth + gap) / (itemWidth + gap)) || 1;
  const rowsCount = Math.ceil(items.length / columnsCount);
  const rowHeight = itemHeight + gap;
  const totalHeight = rowsCount * rowHeight;

  // Calculate visible range
  const { startRow, endRow, offsetY } = useMemo(() => {
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const endRow = Math.min(rowsCount - 1, startRow + visibleRows + overscan * 2);
    const offsetY = startRow * rowHeight;

    return { startRow, endRow, offsetY };
  }, [scrollTop, rowHeight, containerHeight, rowsCount, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; row: number; col: number }> = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columnsCount; col++) {
        const index = row * columnsCount + col;
        if (index < items.length) {
          result.push({ item: items[index], index, row, col });
        }
      }
    }

    return result;
  }, [items, startRow, endRow, columnsCount]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className={cn("overflow-auto will-change-scroll", className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px) translateZ(0)`,
            willChange: "transform",
            display: "grid",
            gridTemplateColumns: `repeat(${columnsCount}, ${itemWidth}px)`,
            gap,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={getKey ? getKey(item, index) : index}
              style={{ height: itemHeight }}
              className="contain-layout"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}) as <T>(props: VirtualGridProps<T>) => ReactNode;
