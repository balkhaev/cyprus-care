'use client';

import { useState } from 'react';
import { Users, Package, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Venue, VenueFunction, ItemWithQuantity, ServiceRequest } from '@/types/venue';
import type { NeedStatus } from '@/types/response';
import { getResponsesForFunction, getNeedStatus } from '@/lib/mock-data/responses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrganizerVenueViewProps {
  venue: Venue;
  onUpdateNeedStatus?: (functionId: string, itemOrServiceId: string, status: NeedStatus) => void;
}

function NeedStatusButton({ 
  currentStatus, 
  onStatusChange 
}: { 
  currentStatus: NeedStatus | undefined;
  onStatusChange: (status: NeedStatus) => void;
}) {
  const statuses: { status: NeedStatus; label: string; color: string }[] = [
    { status: 'need_a_lot', label: 'Need a lot', color: 'bg-red-600 hover:bg-red-700 text-white' },
    { status: 'need_few_more', label: 'Need few more', color: 'bg-amber-600 hover:bg-amber-700 text-white' },
    { status: 'dont_need', label: "Don't need", color: 'bg-green-600 hover:bg-green-700 text-white' },
  ];

  return (
    <div className="flex gap-2 mt-2">
      {statuses.map(({ status, label, color }) => (
        <Button
          key={status}
          size="sm"
          variant={currentStatus === status ? 'default' : 'outline'}
          className={currentStatus === status ? color : ''}
          onClick={() => onStatusChange(status)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function ProjectionBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
        <AlertCircle className="h-3 w-3" />
        No responses
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-xs text-blue-700 dark:text-blue-300">
      <Users className="h-3 w-3" />
      {count} response{count !== 1 ? 's' : ''}
    </div>
  );
}

export default function OrganizerVenueView({ venue, onUpdateNeedStatus }: OrganizerVenueViewProps) {
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set());

  const toggleFunction = (functionId: string) => {
    const newExpanded = new Set(expandedFunctions);
    if (newExpanded.has(functionId)) {
      newExpanded.delete(functionId);
    } else {
      newExpanded.add(functionId);
    }
    setExpandedFunctions(newExpanded);
  };

  const handleStatusChange = (functionId: string, itemOrServiceId: string, status: NeedStatus) => {
    if (onUpdateNeedStatus) {
      onUpdateNeedStatus(functionId, itemOrServiceId, status);
    }
    console.log('Status update:', { functionId, itemOrServiceId, status });
  };

  const renderFunction = (func: VenueFunction) => {
    const responses = getResponsesForFunction(func.id);
    const isExpanded = expandedFunctions.has(func.id);

    if (func.type === 'collection_point' || func.type === 'distribution_point') {
      const isCollection = func.type === 'collection_point';
      
      return (
        <Card key={func.id} className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {isCollection ? 'Collection Point' : 'Distribution Point'}
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {isCollection ? 'Items needed for collection' : 'Items available for distribution'}
              </p>
            </div>
          </div>
          
          {func.items && func.items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Items ({func.items.length})
                </p>
                <ProjectionBadge 
                  count={responses.filter(r => r.responseType === 'item').length} 
                />
              </div>
              
              {func.items.map((item, idx) => {
                const itemResponses = responses.filter(
                  r => r.responseType === 'item' && r.categoryId === item.categoryId
                );
                const currentStatus = getNeedStatus(func.id, item.categoryId);
                const totalQuantityOffered = itemResponses.reduce(
                  (sum, r) => sum + (r.quantityOffered || 0),
                  0
                );

                return (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {item.categoryPath.join(' → ')}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 capitalize mt-1">
                          Original need: {item.quantity.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    {itemResponses.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                            Projected Turnout
                          </p>
                          <button
                            onClick={() => toggleFunction(func.id + '-' + item.categoryId)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {isExpanded ? 'Hide' : 'Show'} details
                          </button>
                        </div>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {itemResponses.length} volunteer{itemResponses.length !== 1 ? 's' : ''} • 
                          Total: {totalQuantityOffered} units
                        </p>
                        
                        {isExpanded && (
                          <div className="mt-2 space-y-1">
                            {itemResponses.map((response) => (
                              <div
                                key={response.id}
                                className="text-xs p-2 bg-white dark:bg-zinc-900 rounded"
                              >
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {response.volunteerName}
                                </p>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                  Quantity: {response.quantityOffered}
                                  {response.message && ` • ${response.message}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <NeedStatusButton
                      currentStatus={currentStatus?.status}
                      onStatusChange={(status) => handleStatusChange(func.id, item.categoryId, status)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      );
    }
    
    if (func.type === 'services_needed') {
      return (
        <Card key={func.id} className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Services Needed
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Volunteer services required
              </p>
            </div>
          </div>
          
          {func.services && func.services.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  Services ({func.services.length})
                </p>
                <ProjectionBadge 
                  count={responses.filter(r => r.responseType === 'service').length} 
                />
              </div>
              
              {func.services.map((service, idx) => {
                const serviceResponses = responses.filter(
                  r => r.responseType === 'service' && r.serviceType === service.type
                );
                const currentStatus = getNeedStatus(func.id, undefined, service.type);

                return (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                            {service.type.replace('_', ' ')}
                          </p>
                          {service.isRequired && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium rounded">
                              Required
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {serviceResponses.length > 0 && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                            Projected Turnout
                          </p>
                          <button
                            onClick={() => toggleFunction(func.id + '-' + service.type)}
                            className="text-xs text-green-600 dark:text-green-400 hover:underline"
                          >
                            {isExpanded ? 'Hide' : 'Show'} details
                          </button>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-300">
                          {serviceResponses.length} volunteer{serviceResponses.length !== 1 ? 's' : ''}
                        </p>
                        
                        {isExpanded && (
                          <div className="mt-2 space-y-1">
                            {serviceResponses.map((response) => (
                              <div
                                key={response.id}
                                className="text-xs p-2 bg-white dark:bg-zinc-900 rounded"
                              >
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {response.volunteerName}
                                </p>
                                {response.message && (
                                  <p className="text-zinc-600 dark:text-zinc-400">
                                    {response.message}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <NeedStatusButton
                      currentStatus={currentStatus?.status}
                      onStatusChange={(status) => handleStatusChange(func.id, service.type, status)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              Organizer View
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Review volunteer responses and update the need status for each item or service.
            </p>
          </div>
        </div>
      </div>
      
      {venue.functions && venue.functions.length > 0 ? (
        <div className="space-y-4">
          {venue.functions.map(renderFunction)}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            No functions or needs defined for this venue yet.
          </p>
        </Card>
      )}
    </div>
  );
}

