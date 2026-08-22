'use client';

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse">
      <div className="h-44 bg-slate-800/80 rounded-2xl w-full" />
      <div className="space-y-2">
        <div className="h-5 bg-slate-800 rounded-md w-3/4" />
        <div className="h-3 bg-slate-800/60 rounded-md w-1/2" />
      </div>
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded-md w-20" />
        <div className="h-4 bg-slate-800 rounded-md w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-800/60">
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-800 rounded w-32" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-800 rounded w-24" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-800 rounded w-28" />
      </td>
      <td className="py-4 px-4">
        <div className="h-4 bg-slate-800 rounded w-16" />
      </td>
      <td className="py-4 px-4 text-right">
        <div className="h-6 bg-slate-800 rounded-lg w-14 ml-auto" />
      </td>
    </tr>
  );
}
