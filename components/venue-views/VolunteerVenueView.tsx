'use client';

import { useState } from 'react';
import { Hand, Package, CheckCircle } from 'lucide-react';
import type { Venue, VenueFunction, ItemWithQuantity, ServiceRequest } from '@/types/venue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VolunteerVenueViewProps {
  venue: Venue;
  onRespond?: (response: ResponseData) => void;
}

export interface ResponseData {
  functionId: string;
  responseType: 'item' | 'service';
  categoryId?: string;
  serviceType?: string;
  quantity?: number;
  message?: string;
}

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResponseData) => void;
  functionId: string;
  item?: ItemWithQuantity;
  service?: ServiceRequest;
}

function ResponseModal({ isOpen, onClose, onSubmit, functionId, item, service }: ResponseModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const responseData: ResponseData = {
      functionId,
      responseType: item ? 'item' : 'service',
      message: message || undefined,
    };

    if (item) {
      responseData.categoryId = item.categoryId;
      responseData.quantity = quantity;
    } else if (service) {
      responseData.serviceType = service.type;
    }

    onSubmit(responseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          {item ? 'Respond to Item Need' : 'Respond to Service Need'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {item && (
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.categoryPath.join(' → ')}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Need level: <span className="capitalize">{item.quantity.replace('_', ' ')}</span>
              </p>
            </div>
          )}
          
          {service && (
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                {service.type.replace('_', ' ')}
              </p>
              {service.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {service.description}
                </p>
              )}
            </div>
          )}
          
          {item && (
            <div>
              <Label htmlFor="quantity">Quantity you can provide</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              rows={3}
              placeholder="Add any additional information..."
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Submit Response
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VolunteerVenueView({ venue, onRespond }: VolunteerVenueViewProps) {
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean;
    functionId: string;
    item?: ItemWithQuantity;
    service?: ServiceRequest;
  }>({ isOpen: false, functionId: '' });

  const handleOpenResponseModal = (
    functionId: string,
    item?: ItemWithQuantity,
    service?: ServiceRequest
  ) => {
    setResponseModal({ isOpen: true, functionId, item, service });
  };

  const handleCloseResponseModal = () => {
    setResponseModal({ isOpen: false, functionId: '' });
  };

  const handleSubmitResponse = (data: ResponseData) => {
    if (onRespond) {
      onRespond(data);
    }
    console.log('Volunteer response:', data);
  };

  const renderFunction = (func: VenueFunction) => {
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
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                Items ({func.items.length})
              </p>
              {func.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.categoryPath.join(' → ')}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 capitalize">
                      Need level: {item.quantity.replace('_', ' ')}
                    </p>
                  </div>
                  {isCollection && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenResponseModal(func.id, item)}
                      className="ml-3"
                    >
                      <Hand className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {func.specialRequests && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
                Special Requests
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-400">
                {func.specialRequests}
              </p>
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
              <Hand className="h-5 w-5 text-green-600 dark:text-green-400" />
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
            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                Services ({func.services.length})
              </p>
              {func.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
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
                  <Button
                    size="sm"
                    onClick={() => handleOpenResponseModal(func.id, undefined, service)}
                    className="ml-3"
                  >
                    <Hand className="h-4 w-4 mr-1" />
                    Respond
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {func.specialRequests && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
                Special Requests
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-400">
                {func.specialRequests}
              </p>
            </div>
          )}
        </Card>
      );
    }
    
    if (func.type === 'custom') {
      return (
        <Card key={func.id} className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {func.customTypeName}
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {func.customTypeDescription}
              </p>
            </div>
          </div>
          
          {func.items && func.items.length > 0 && (
            <div className="space-y-2 mt-3">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                Items
              </p>
              {func.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.categoryPath.join(' → ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Hand className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Volunteer View
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Review the needs below and click &quot;Respond&quot; to volunteer your help with items or services.
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
      
      <ResponseModal
        isOpen={responseModal.isOpen}
        onClose={handleCloseResponseModal}
        onSubmit={handleSubmitResponse}
        functionId={responseModal.functionId}
        item={responseModal.item}
        service={responseModal.service}
      />
    </div>
  );
}

