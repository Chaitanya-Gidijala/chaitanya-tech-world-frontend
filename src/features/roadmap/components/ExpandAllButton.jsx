import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/design-system';

export default function ExpandAllButton({ allOpen, onClick }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      iconStart={allOpen ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
    >
      {allOpen ? 'Collapse all' : 'Expand all'}
    </Button>
  );
}
