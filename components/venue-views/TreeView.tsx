'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Package } from 'lucide-react';
import type { ItemWithQuantity } from '@/types/venue';
import type { NeedStatus, VolunteerResponse } from '@/types/response';

interface TreeNodeData {
  name: string;
  children: Map<string, TreeNodeData>;
  items: ItemWithQuantity[];
}

interface TreeNodeProps {
  name: string;
  data: TreeNodeData;
  level: number;
  functionId: string;
  responses: VolunteerResponse[];
  getNeedStatus: (functionId: string, categoryId: string) => { status: NeedStatus } | undefined;
  onStatusChange: (categoryId: string, status: NeedStatus) => void;
  onToggleDetails: (key: string) => void;
  isDetailsExpanded: boolean;
  renderItem: (
    item: ItemWithQuantity,
    level: number,
    responses: VolunteerResponse[],
    currentStatus: { status: NeedStatus } | undefined
  ) => React.ReactNode;
  expandAll: boolean;
}

export function TreeNode({
  name,
  data,
  level,
  functionId,
  responses,
  getNeedStatus,
  onStatusChange,
  onToggleDetails,
  isDetailsExpanded,
  renderItem,
  expandAll
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true); // По умолчанию раскрыт
  const hasChildren = data.children.size > 0;
  const hasItems = data.items.length > 0;

  const paddingClass = `pl-${level * 4}`;

  // Синхронизируем локальное состояние с глобальным expandAll
  useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 ${paddingClass} hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded cursor-pointer transition-colors`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {(hasChildren || hasItems) && (
          <span className="text-zinc-500 dark:text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {!hasChildren && !hasItems && (
          <span className="w-4" />
        )}
        <Package className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {name}
        </span>
        {hasChildren && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({data.children.size + data.items.length})
          </span>
        )}
      </div>

      {isExpanded && (
        <div>
          {/* Дочерние категории */}
          {Array.from(data.children.entries()).map(([childName, childData]) => (
            <TreeNode
              key={childName}
              name={childName}
              data={childData}
              level={level + 1}
              functionId={functionId}
              responses={responses}
              getNeedStatus={getNeedStatus}
              onStatusChange={onStatusChange}
              onToggleDetails={onToggleDetails}
              isDetailsExpanded={isDetailsExpanded}
              renderItem={renderItem}
              expandAll={expandAll}
            />
          ))}

          {/* Элементы на текущем уровне */}
          {data.items.map((item) => {
            const currentStatus = getNeedStatus(functionId, item.categoryId);
            return (
              <div key={item.categoryId} className={`pl-${(level + 1) * 4}`}>
                {renderItem(item, level + 1, responses, currentStatus)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps {
  items: ItemWithQuantity[];
  functionId: string;
  responses: VolunteerResponse[];
  getNeedStatus: (functionId: string, categoryId: string) => { status: NeedStatus } | undefined;
  onStatusChange: (categoryId: string, status: NeedStatus) => void;
  onToggleDetails: (key: string) => void;
  isDetailsExpanded: (key: string) => boolean;
  renderItem: (
    item: ItemWithQuantity,
    level: number,
    responses: VolunteerResponse[],
    currentStatus: { status: NeedStatus } | undefined
  ) => React.ReactNode;
  showExpandCollapseButton?: boolean;
}

export function TreeView({
  items,
  functionId,
  responses,
  getNeedStatus,
  onStatusChange,
  onToggleDetails,
  isDetailsExpanded,
  renderItem,
  showExpandCollapseButton = true
}: TreeViewProps) {
  const [expandAll, setExpandAll] = useState(true); // По умолчанию всё раскрыто

  // Строим дерево из плоского списка items
  const buildTree = (items: ItemWithQuantity[]): Map<string, TreeNodeData> => {
    const root = new Map<string, TreeNodeData>();

    items.forEach((item) => {
      let currentLevel = root;
      
      // Проходим по пути категории, создавая узлы по мере необходимости
      for (let i = 0; i < item.categoryPath.length; i++) {
        const pathPart = item.categoryPath[i];
        const isLastPart = i === item.categoryPath.length - 1;

        if (!currentLevel.has(pathPart)) {
          currentLevel.set(pathPart, {
            name: pathPart,
            children: new Map(),
            items: []
          });
        }

        const node = currentLevel.get(pathPart)!;

        // Если это последняя часть пути, добавляем item в узел
        if (isLastPart) {
          node.items.push(item);
        } else {
          // Иначе переходим к дочерним узлам
          currentLevel = node.children;
        }
      }
    });

    return root;
  };

  const tree = buildTree(items);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        No items available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showExpandCollapseButton && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      )}
      <div className="space-y-1">
        {Array.from(tree.entries()).map(([rootName, rootData]) => (
          <TreeNode
            key={rootName}
            name={rootName}
            data={rootData}
            level={0}
            functionId={functionId}
            responses={responses}
            getNeedStatus={getNeedStatus}
            onStatusChange={onStatusChange}
            onToggleDetails={onToggleDetails}
            isDetailsExpanded={isDetailsExpanded(rootName)}
            renderItem={renderItem}
            expandAll={expandAll}
          />
        ))}
      </div>
    </div>
  );
}

