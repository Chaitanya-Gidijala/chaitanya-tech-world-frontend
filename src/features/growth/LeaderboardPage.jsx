import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Container, Section, useDocumentMeta } from '@/design-system';
import PageHero from '@/components/site/PageHero';
import Leaderboard from './Leaderboard';
import ShareBar from './ShareBar';
import NewsletterSignup from './NewsletterSignup';
import './growth.css';

export default function LeaderboardPage() {
  useDocumentMeta({
    title: 'Traceflow Daily Leaderboard — Today, This Week & Streaks | Chaitanya Tech World',
    description: 'See who is topping the daily algorithm puzzle: today’s fastest perfect scores, this week’s leaders and the longest streaks.',
  });

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Traceflow Daily', to: '/daily' }, { label: 'Leaderboard' }]}
        eyebrow="Leaderboard"
        title={
          <>
            Who’s on top <span className="ds-gradient-text">today?</span>
          </>
        }
        description="Ranked by score, then time. Signed-in players appear by first name; everyone else stays anonymous."
        actions={
          <Button to="/daily" size="lg" iconEnd={<ArrowRight size={16} />}>
            Play today’s puzzle
          </Button>
        }
      />
      <Section compact>
        <Container size="narrow">
          <div className="gr-stack">
            <Leaderboard />
            <ShareBar url="/leaderboard" text="Can you beat the Traceflow Daily leaderboard? A 2-minute algorithm puzzle." campaign="leaderboard" title="Challenge a friend" />
            <NewsletterSignup source="leaderboard" />
            <p className="gr-note">
              Want to practise first? <Link to="/daily/archive">Replay past puzzles</Link>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
