'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

export function AppBreadcrumb() {
  const instanceLabel = useCallback((url: string, defaultLabel: string) => {
    const urlParts = url.split('/');
    const lastUrlPiece = urlParts[urlParts.length - 1];
    const instance: { id: string; title: string } = [].find(
      (instance: { id: string }) => {
        if (instance?.id === lastUrlPiece) {
          return true;
        }
        return false;
      },
    );
    return instance?.title ?? defaultLabel;
  }, []);
  const [breadcrumb, setBreadcrumb] = useState([]);
  useEffect(() => {
    const mapBreadCrumb = (
      sourceBreadCrumb: [{ id: string }],
      dataInstance: { id: string } | undefined,
    ): [{ id: string }] => {
      if (!Array.isArray(sourceBreadCrumb)) {
        return [];
      }
      return sourceBreadCrumb.map((item, index) => {
        return {
          ...item,
          instance: index === 0 ? dataInstance : undefined,
        };
      });
    };
    if (typeof window !== 'undefined') {
      switch (window.location?.pathname) {
        case '/setup':
          setBreadcrumb(
            mapBreadCrumb(
              [{ id: 'setup', label: 'Setup', url: '/setup' }],
              undefined,
            ),
          );
          break;
        case '/account':
          setBreadcrumb(
            mapBreadCrumb(
              [{ id: 'account', label: 'Account', url: '/account' }],
              undefined,
            ),
          );
          break;
        default:
          setBreadcrumb(mapBreadCrumb([], undefined));
          break;
      }
      return;
    }
    setBreadcrumb(mapBreadCrumb([], undefined));
  }, []);
  const title = useMemo(() => {
    if (!Array.isArray(breadcrumb) || !breadcrumb.length) {
      return 'Dashboard';
    }
    return breadcrumb.reduce((accumulator, breadcrumbItem) => {
      const { url, label }: { url: string; label: string } = breadcrumbItem;
      const displayText = instanceLabel(url, label);
      return accumulator + ' - ' + displayText;
    }, '');
  }, [breadcrumb, instanceLabel]);
  const items = useMemo(() => {
    const itemsWithSeparators = [];
    if (!Array.isArray(breadcrumb) || !breadcrumb.length) {
      return (
        <BreadcrumbItem className="hidden md:block">Dashboard</BreadcrumbItem>
      );
    }
    for (let i = 0; i < breadcrumb.length; i++) {
      const { url, label }: { url: string; label: string } = breadcrumb[i];
      const isLast = i === breadcrumb.length - 1;
      const displayText = instanceLabel(url, label);
      itemsWithSeparators.push(
        <BreadcrumbItem className="hidden md:block" key={`${url}-item`}>
          {isLast ? (
            displayText
          ) : (
            <BreadcrumbLink href={url}>{displayText}</BreadcrumbLink>
          )}
        </BreadcrumbItem>,
      );
      if (i < breadcrumb.length - 1) {
        itemsWithSeparators.push(
          <BreadcrumbSeparator
            className="hidden md:block"
            key={`${url}-separator`}
          />,
        );
      }
    }
    return itemsWithSeparators as [ReactNode];
  }, [breadcrumb, instanceLabel]);
  useEffect(() => {
    document.title = `Web3 Coding Challenge ${title}`;
  }, [title]);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>{items}</BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
