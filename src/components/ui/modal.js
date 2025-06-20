'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className={`w-full ${sizes[size]} transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-gray-200`}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Header with gradient */}
                  <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      {title && (
                        <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                          <span>{title}</span>
                        </Dialog.Title>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 group"
                      >
                        <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                      </button>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="px-8 py-6 bg-white">
                    {children}
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
