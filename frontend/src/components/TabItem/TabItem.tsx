import { JSX } from 'react';

type TabItemProps = {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
};

export default function TabItem({
  id,
  label,
  active,
  onClick,
}: TabItemProps): JSX.Element {
  return (
    <li className="nav-item">
      <a
        className={`d-flex m-2 py-2 bg-light rounded-pill ${active ? 'active' : ''}`}
        data-bs-toggle="pill"
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          onClick(id);
        }}
      >
        <span className="text-dark" style={{ width: '130px' }}>
          {label}
        </span>
      </a>
    </li>
  );
}
