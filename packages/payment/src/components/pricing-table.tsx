'use client';

import React from 'react';
import type { Plan } from '../types';
import { formatPrice } from '../lib/price-format';

export interface PricingTableProps {
  plans: Plan[];
  currentPlanId?: string;
  onSelect: (planId: string) => void;
}

export function PricingTable({ plans, currentPlanId, onSelect }: PricingTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3" role="list">
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        return (
          <div
            key={plan.id}
            role="listitem"
            className={`rounded-lg border p-6 ${isCurrent ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'}`}
            data-current={isCurrent || undefined}
          >
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}
            <p className="mt-4 text-3xl font-bold">
              {formatPrice(plan.price)}
              <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
            </p>
            {plan.features && (
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm">✓ {feature}</li>
                ))}
              </ul>
            )}
            <button
              className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium ${
                isCurrent
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={isCurrent}
              onClick={() => onSelect(plan.id)}
            >
              {isCurrent ? '현재 플랜' : '선택하기'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
