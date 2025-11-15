'use client';

import { useState } from 'react';
import { Users, Package, CheckCircle } from 'lucide-react';
import type { Venue, DistributionPointFunction } from '@/types/venue';
import { getCommitmentsForFunction } from '@/lib/mock-data/responses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeneficiaryVenueViewProps {
  venue: Venue;
  onCommit?: (functionId: string) => void;
}

export default function BeneficiaryVenueView({ venue, onCommit }: BeneficiaryVenueViewProps) {
  const [committedFunctions, setCommittedFunctions] = useState<Set<string>>(new Set());

  const handleCommit = (functionId: string) => {
    const newCommitted = new Set(committedFunctions);
    newCommitted.add(functionId);
    setCommittedFunctions(newCommitted);
    
    if (onCommit) {
      onCommit(functionId);
    }
    console.log('Beneficiary commitment:', functionId);
  };

  const renderFunction = (func: DistributionPointFunction) => {
    const commitments = getCommitmentsForFunction(func.id);
    const hasCommitted = committedFunctions.has(func.id);

    return (
      <Card key={func.id} className="p-4 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Distribution Point
              </h4>
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                Available
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Items available for distribution
            </p>
          </div>
        </div>
        
        {func.items && func.items.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Available Items ({func.items.length})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {func.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.categoryPath[item.categoryPath.length - 1]}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 capitalize">
                    {item.quantity.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {func.openingTimes && func.openingTimes.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Distribution Hours
            </p>
            <div className="space-y-1">
              {func.openingTimes.slice(0, 3).map((hours, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-blue-800 dark:text-blue-300 font-medium">
                    {hours.dayOfWeek}
                  </span>
                  {hours.isClosed ? (
                    <span className="text-blue-600 dark:text-blue-400">Closed</span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400">
                      {hours.openTime} - {hours.closeTime}
                    </span>
                  )}
                </div>
              ))}
              {func.openingTimes.length > 3 && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  +{func.openingTimes.length - 3} more days
                </p>
              )}
            </div>
          </div>
        )}
        
        {commitments.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                Expected Beneficiaries
              </p>
            </div>
            <p className="text-sm text-green-800 dark:text-green-300">
              {commitments.length} {commitments.length === 1 ? 'person has' : 'people have'} confirmed attendance
            </p>
          </div>
        )}
        
        {func.specialRequests && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
              Important Information
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400">
              {func.specialRequests}
            </p>
          </div>
        )}
        
        <Button
          onClick={() => handleCommit(func.id)}
          disabled={hasCommitted}
          className="w-full"
        >
          {hasCommitted ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmed
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              I will be there
            </>
          )}
        </Button>
      </Card>
    );
  };

  // Filter only distribution point functions
  const distributionFunctions = venue.functions.filter(
    (func): func is DistributionPointFunction => func.type === 'distribution_point'
  );

  return (
    <div className="space-y-4">
      {distributionFunctions.length > 0 ? (
        <div className="space-y-4">
          {distributionFunctions.map(renderFunction)}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 text-zinc-400 mx-auto mb-3" />
          <p className="text-zinc-900 dark:text-zinc-100 font-medium mb-1">
            No distribution points at this venue
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This venue does not currently have any distribution points set up.
          </p>
        </Card>
      )}
      
      {/* Show other functions for information only */}
      {venue.functions.filter(f => f.type !== 'distribution_point').length > 0 && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Other Functions (Information Only)
          </h4>
          <div className="space-y-2">
            {venue.functions
              .filter(f => f.type !== 'distribution_point')
              .map((func) => {
                let label = '';
                let description = '';
                
                if (func.type === 'collection_point') {
                  label = 'Collection Point';
                  description = 'This venue collects donations';
                } else if (func.type === 'services_needed') {
                  label = 'Services Needed';
                  description = 'This venue needs volunteer services';
                } else if (func.type === 'custom') {
                  label = func.customTypeName;
                  description = func.customTypeDescription;
                }
                
                return (
                  <Card key={func.id} className="p-3 opacity-60">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {label}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

