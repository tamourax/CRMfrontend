import { useT } from '../../preferences/LocaleProvider';
import { useSearchParams } from 'react-router-dom';
import { useDealAssistant } from './useDealAssistant';
import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  ArrowUp,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { AiContent, PageHeader } from '../../components';

export function AssistantPage() {
  const t = useT();
  const suggestions = [
    {
      question: t('ui.what_are_the_highest_value_open_deals'),
      icon: CircleDollarSign,
      label: t('ui.find_your_next_big_win'),
    },
    {
      question: t('ui.which_deals_are_expected_to_close_this_month'),
      icon: Clock3,
      label: t('ui.plan_your_month'),
    },
    {
      question: t('ui.which_customers_have_the_most_active_deals'),
      icon: Users,
      label: t('ui.know_your_key_relationships'),
    },
    {
      question: t('ui.what_is_the_total_value_of_deals_in_the_negotiation_stage'),
      icon: MessageSquare,
      label: t('ui.understand_your_pipeline'),
    },
    {
      question: t('ui.what_are_the_reasons_behind_the_lost_deals'),
      icon: MessageSquare,
      label: t('ui.learn_from_lost_opportunities'),
    },
  ];
  const [params] = useSearchParams();
  const [question, setQuestion] = useState(params.get('question') || '');
  const { messages, status, isPending, send: sendQuestion, retry } = useDealAssistant();
  function send(text: string) {
    if (sendQuestion(text)) setQuestion('');
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    send(question);
  }
  return (
    <>
      <PageHeader
        eyebrow={t('ui.a_fresh_perspective')}
        title={t('ui.your_deal_assistant')}
        description={t('details.assistantHint')}
        action={
          <span className="header-tag">
            <ShieldCheck size={15} /> {t('ui.read_only_access')}{' '}
          </span>
        }
      />
      <section className="assistant-panel">
        {status.data && !status.data.ai_configured && (
          <div className="configuration-notice" role="status">
            <Sparkles size={18} />
            <div>
              <strong>{t('ui.ai_is_not_configured_yet')}</strong>
              <p>
                {' '}
                {t(
                  'ui.your_crm_is_ready_add_a_valid_ai_api_key_to_enable_live_answers_no_simulated_answers_are_shown',
                )}{' '}
              </p>
            </div>
          </div>
        )}
        <div className="conversation" aria-live="polite">
          {messages.length === 0 ? (
            <div className="assistant-welcome">
              <div className="assistant-orb">
                <Sparkles size={33} />
              </div>
              <span className="eyebrow">{t('ui.meet_your_workspace_copilot')}</span>
              <h2>
                {' '}
                {t('ui.a_good_question_can')} <br /> {t('ui.open_a_new_opportunity')}{' '}
              </h2>
              <p>
                {' '}
                {t('ui.i_can_help_you_explore_your_deals_understand_your_pipeline')} <br />{' '}
                {t('ui.and_see_where_to_focus_next_using_your_actual_crm_data')}{' '}
              </p>
              <div className="suggestion-grid">
                {suggestions.map(({ question: text, icon: Icon, label }) => (
                  <button key={text} onClick={() => send(text)}>
                    <Icon size={20} />
                    <strong>{label}</strong>
                    <span>{text}</span>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div className="message-pair" key={message.id}>
                <div className="user-message">{message.question}</div>
                <div className="assistant-message">
                  <span className="message-avatar">
                    <Sparkles size={17} />
                  </span>
                  <div>
                    {message.result ? (
                      <AiContent result={message.result} />
                    ) : message.error ? (
                      <div className="inline-error" role="alert">
                        {message.error}
                        <button
                          className="text-link"
                          onClick={() => retry(message)}
                          disabled={isPending}
                        >
                          {' '}
                          {t('ui.try_again')}{' '}
                        </button>
                      </div>
                    ) : (
                      <div className="thinking" role="status">
                        <LoaderCircle size={17} className="spin" />{' '}
                        {t('ui.checking_your_crm_records')}{' '}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="composer-area">
          <form onSubmit={submit} className="chat-composer">
            <label htmlFor="question" className="sr-only">
              {' '}
              {t('ui.ask_about_your_deals')}{' '}
            </label>
            <textarea
              id="question"
              maxLength={2000}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder={t('ui.ask_about_your_deals_customers_or_pipeline')}
              rows={2}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(question);
                }
              }}
            />
            <button aria-label={t('ui.send_question')} disabled={!question.trim() || isPending}>
              {isPending ? <LoaderCircle className="spin" size={19} /> : <ArrowUp size={21} />}
            </button>
          </form>
          <p>
            <ShieldCheck size={12} />{' '}
            {t(
              'ui.only_your_accessible_records_are_used_each_question_is_independent_recommendations_may_need_review',
            )}{' '}
          </p>
        </div>
      </section>
    </>
  );
}
