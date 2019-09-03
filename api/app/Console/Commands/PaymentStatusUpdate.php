<?php
namespace App\Console\Commands;
use App\Http\Controllers\CronJobController;
use Illuminate\Console\Command;
class PaymentStatusUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gclpayment:status';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update gocardless payment status';
    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $cron = new CronJobController();
        $cron->updateGoCardLessPaymentStatus();
    }
}