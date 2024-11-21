import plotly.express as px

def create(df):
    fig = px.line(df)
    fig.update_layout(
        paper_bgcolor="black",
        plot_bgcolor="black",
        font=dict(color="gray"),
        xaxis_title='Price',  # Set X-axis label
        yaxis_title='Date OHLC',
    )
    fig.update_traces(
        hovertemplate=
        'Price: %{y}<br>'+  # Show Y value with custom label
        'Date OHLC: %{x}<br>',  # Show X value with custom label
    )
    fig.show()